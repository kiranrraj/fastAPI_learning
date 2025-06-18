# File: app/services/labx_graph_janus.py
import json
import asyncio
import pandas as pd
from datetime import datetime
from typing import Any, Dict, List
from concurrent.futures import ThreadPoolExecutor
from gremlin_python.driver.client import Client

from app.models import ENTITY_MODEL_MAP
from app.config import config
from app.logger import get_logger
from app.utils.labx_validation_exceptions import GraphConnectionError
from app.utils.labx_time_utils import format_to_mmddyyyy_hhmmss
from app.utils.labx_duplicate_utils import filter_duplicates
from app.utils.labx_gremlin_utils import (
    format_gremlin_properties,
    flatten_vertex_result,
    clean_element_map,
    dataframe_to_dict_list
)
from app.utils.labx_model_utils import sanitize_update_properties

logger = get_logger("labx-graph")

class LabXGraphJanus:
    def __init__(self, client: Client):
        self.client = client
        self.executor = ThreadPoolExecutor()

    @classmethod
    async def create(cls) -> "LabXGraphJanus":
        try:
            logger.info(f"Connecting to JanusGraph at {config.janus_uri}")
            client = Client(
                url=config.janus_uri,
                traversal_source="g",
                pool_size=4
            )
            return cls(client)
        except Exception as e:
            logger.error(f"Failed to connect to JanusGraph: {e}")
            raise GraphConnectionError("JanusGraph connection failed")

    async def close(self):
        try:
            transport = getattr(self.client, "_transport", None)
            if transport:
                close_method = getattr(transport, "close", None)
                if asyncio.iscoroutinefunction(close_method):
                    await close_method()
                elif callable(close_method):
                    await asyncio.to_thread(close_method)
            self.client = None
            logger.info("[Graph] Gremlin client closed cleanly.")
        except Exception as e:
            logger.error("[Graph] Error during shutdown: Failed to close client", exc_info=e)

    async def submit(self, query: str, bindings: Dict[str, Any] = None) -> List[Any]:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(
            self.executor,
            lambda: self._submit_sync(query, bindings or {})
        )

    def _submit_sync(self, query: str, bindings: Dict[str, Any]) -> List[Any]:
        logger.debug(f"Executing Gremlin query: {query} | Bindings: {bindings}")
        result_set = self.client.submit(query, bindings)
        return result_set.all().result()

    async def query_vertices(self, label: str, filters: Dict[str, Any], limit: int = 100, skip: int = 0) -> Dict[str, Any]:
        try:
            base = f"g.V().hasLabel('{label}')"
            for key, val in filters.items():
                if val is not None and val != "":
                    safe_val = json.dumps(val)
                    base += f".has('{key}', {safe_val})"

            base += f".range({skip}, {skip + limit}).valueMap(true)"
            results = await self.submit(base)

            parsed = [flatten_vertex_result(clean_element_map(row)) for row in results]
            return {"status": "success", "data": parsed}
        except Exception as e:
            logger.error(f"[QueryVertices] Failed to fetch '{label}'", exc_info=e)
            return {"status": "error", "data": [], "message": str(e)}

    async def add_vertex(self, label: str, properties: Dict[str, Any]) -> Dict[str, Any]:
        retries = 3
        for attempt in range(retries):
            try:
                prop_string = format_gremlin_properties(properties)
                query = f"g.addV('{label}'){prop_string}.id()"
                results = await self.submit(query)
                if results and isinstance(results, list) and len(results) > 0:
                    return {"status": "success", "data": str(results[0])}
                else:
                    return {"status": "error", "message": "Vertex insert returned empty result."}
            except Exception as e:
                logger.warning(f"[AddVertex] Attempt {attempt+1} failed for label '{label}': {e}")
                await asyncio.sleep(0.5 * (attempt + 1))
        logger.error(f"[AddVertex] Failed to add vertex '{label}' after {retries} attempts.")
        return {"status": "error", "message": f"Retry limit exceeded for label '{label}'"}

    async def update_vertex(self, label: str, vertex_id: Any, properties: Dict[str, Any]) -> Dict[str, Any]:
        try:
            new_props = sanitize_update_properties(label, properties)
            query = f"g.V({json.dumps(vertex_id)}).hasLabel('{label}').valueMap(true)"
            existing_data_raw = await self.submit(query)

            if not existing_data_raw:
                return {"status": "error", "id": vertex_id, "message": "Vertex not found"}

            cleaned_raw = clean_element_map(existing_data_raw[0])
            existing_data = flatten_vertex_result(cleaned_raw)
            existing_data.pop("id", None)

            changed_fields = {}
            for k, v in new_props.items():
                if k == "created_at":
                    continue
                old_val = existing_data.get(k)
                if isinstance(old_val, list) and len(old_val) == 1:
                    old_val = old_val[0]
                if str(old_val) != str(v):
                    changed_fields[k] = v

            if not changed_fields:
                return {"status": "not_updated", "id": vertex_id}

            changed_fields["updated_at"] = format_to_mmddyyyy_hhmmss(datetime.utcnow())
            prop_str = format_gremlin_properties(changed_fields)
            update_query = f"g.V({json.dumps(vertex_id)}).hasLabel('{label}'){prop_str}.id()"
            result = await self.submit(update_query)

            if result and isinstance(result, list) and len(result) > 0:
                return {"status": "updated", "id": result[0], "updated_fields": changed_fields}
            else:
                return {"status": "error", "id": vertex_id, "message": "Update failed – empty response from JanusGraph"}
        except Exception as e:
            logger.error(f"[UpdateVertex] Failed for ID {vertex_id} on label '{label}'", exc_info=e)
            return {"status": "error", "id": vertex_id, "message": str(e)}

    async def delete_vertices(self, label: str, ids: List[str]) -> Dict[str, Any]:
        results = []
        for id_ in ids:
            try:
                exists = await self._vertex_exists(label, id_)
                if not exists:
                    results.append({"id": id_, "status": "not_found", "message": "ID not found"})
                    continue
                query = f"g.V({json.dumps(id_)}).hasLabel('{label}').drop()"
                await self.submit(query)
                results.append({"id": id_, "status": "deleted", "message": "Deleted successfully"})
            except Exception as e:
                logger.error(f"[Delete] Error deleting ID {id_}", exc_info=e)
                results.append({"id": id_, "status": "error", "message": str(e)})

        overall_status = (
            "success" if all(r["status"] == "deleted" for r in results)
            else "failed" if all(r["status"] == "not_found" for r in results)
            else "partial"
        )

        return {
            "status": overall_status,
            "results": results,
            "message": f"Processed {len(results)} ID(s) for label '{label}'"
        }

    async def store(self, vertices: Dict[str, pd.DataFrame], edges: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        inserted_ids = []
        try:
            if vertices:
                for label, df in vertices.items():
                    if df.empty:
                        logger.warning(f"[Store] Vertex DataFrame for label '{label}' is empty")
                        continue

                    records = dataframe_to_dict_list(df)
                    logger.info(f"[Store] Adding {len(records)} vertex record(s) for '{label}'")
                    for rec in records:
                        result = await self.add_vertex(label, rec)
                        if result["status"] == "success":
                            inserted_ids.append(result["data"])
                        else:
                            logger.warning(f"[Store] Failed to insert vertex for label '{label}': {result['message']}")

            if edges:
                for label, df in edges.items():
                    if df.empty:
                        continue
                    logger.info(f"[Store] Creating edges for label '{label}'")
                    await self.create_edges(label, df)

            return {
                "status": "success",
                "message": f"Inserted {len(inserted_ids)} vertex record(s)",
                "data": inserted_ids
            }
        except Exception as e:
            logger.error("[Store] Error while storing vertices/edges", exc_info=e)
            return {
                "status": "error",
                "message": str(e),
                "data": []
            }

    async def create_edges(self, label: str, df: pd.DataFrame):
        for _, row in df.iterrows():
            try:
                from_id = row.get("from")
                to_id = row.get("to")
                if not from_id or not to_id:
                    logger.warning(f"[Edge] Missing 'from' or 'to' in row: {row.to_dict()}")
                    continue
                prop_data = {k: v for k, v in row.to_dict().items() if k not in ("from", "to")}
                prop_str = format_gremlin_properties(prop_data)
                query = f"g.V({json.dumps(from_id)}).addE('{label}').to(g.V({json.dumps(to_id)})){prop_str}.id()"
                await self.submit(query)
            except Exception as e:
                logger.error(f"[Edge] Failed to create edge '{label}' from {row.get('from')} to {row.get('to')}", exc_info=e)

    async def _vertex_exists(self, label: str, vertex_id: str) -> bool:
        try:
            query = f"g.V({json.dumps(vertex_id)}).hasLabel('{label}').count()"
            result = await self.submit(query)
            return result and result[0] > 0
        except Exception as e:
            logger.error(f"[CheckExistence] Error checking vertex {vertex_id} of label '{label}'", exc_info=e)
            return False
