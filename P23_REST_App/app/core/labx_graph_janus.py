from gremlin_python.driver.client import Client
import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import Any, Dict, List
from app.config import config
from app.logger import get_logger
from app.utils.duplicate_filter import filter_duplicates
from app.exceptions import GraphConnectionError, VertexInsertError
from app.models.labx_models import (
    BranchModel, StaffModel, PatientModel, InvestigationGroupModel,
    InvestigationModel, OrderModel, ResultModel
)
import json

logger = get_logger("labx-graph")

ENTITY_MODEL_MAP = {
    "Branch": BranchModel,
    "Staff": StaffModel,
    "Patient": PatientModel,
    "InvestigationGroup": InvestigationGroupModel,
    "Investigation": InvestigationModel,
    "Order": OrderModel,
    "Result": ResultModel
}

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

    async def add_vertex(self, label: str, properties: Dict[str, Any]) -> Dict[str, Any]:
        try:
            prop_string = self._format_properties(properties)
            query = f"g.addV('{label}'){prop_string}.id()"
            logger.debug(f"[AddVertex] Executing query: {query} | Properties: {properties}")
            results = await self.submit(query)
            if results and isinstance(results, list) and len(results) > 0:
                return {"status": "success", "data": str(results[0])}
            else:
                return {"status": "error", "message": "Vertex insert returned empty result."}
        except Exception as e:
            logger.error(f"[AddVertex] Failed to add vertex '{label}'", exc_info=e)
            return {"status": "error", "message": str(e)}

    async def update_vertex(self, label: str, vertex_id: Any, properties: Dict[str, Any]) -> Dict[str, Any]:
        try:
            new_props = self._sanitize_update_properties(label, properties)
            query = f"g.V({json.dumps(vertex_id)}).hasLabel('{label}').valueMap(true)"
            existing_data_raw = await self.submit(query)
            if not existing_data_raw:
                return {"status": "error", "id": vertex_id, "message": "Vertex not found"}

            existing_data = self._clean_results(existing_data_raw)[0]
            existing_data.pop("id", None)
            changed_fields = self._get_changed_fields(existing_data, new_props)
            if not changed_fields:
                return {"status": "not_updated", "id": vertex_id}

            prop_str = self._format_properties(changed_fields)
            update_query = f"g.V({json.dumps(vertex_id)}).hasLabel('{label}'){prop_str}.id()"
            logger.debug(f"[UpdateVertex] Executing: {update_query} | Changed: {changed_fields}")

            result = await self.submit(update_query)
            if result and isinstance(result, list) and len(result) > 0:
                updated_id = result[0]
                return {
                    "status": "updated",
                    "id": updated_id,
                    "updated_fields": changed_fields
                }
            else:
                logger.error(f"[UpdateVertex] Empty result after update. Query: {update_query}")
                return {
                    "status": "error",
                    "id": vertex_id,
                    "message": "Update failed – empty response from JanusGraph"
                }
        except Exception as e:
            logger.error(f"[UpdateVertex] Failed for ID {vertex_id} on label '{label}'", exc_info=e)
            return {
                "status": "error",
                "id": vertex_id,
                "message": str(e)
            }

    async def query_vertices(self, label: str, filters: Dict[str, Any] = None, limit: int = None, skip: int = None) -> Dict[str, Any]:
        try:
            query = f"g.V().hasLabel('{label}')"
            if filters:
                for k, v in filters.items():
                    query += f".has('{k}', {json.dumps(v)})"
            if skip is not None and limit is not None:
                query += f".range({skip}, {skip + limit})"
            elif skip is not None:
                query += f".range({skip}, -1)"
            elif limit is not None:
                query += f".limit({limit})"
            query += ".valueMap(true)"
            logger.debug(f"[QueryVertices] Executing: {query}")
            result = await self.submit(query)
            return {"status": "success", "data": self._clean_results(result)}
        except Exception as e:
            logger.error(f"[QueryVertices] Failed for label '{label}': {e}", exc_info=e)
            return {"status": "error", "message": str(e)}

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

        if all(r["status"] == "deleted" for r in results):
            overall_status = "success"
        elif all(r["status"] == "not_found" for r in results):
            overall_status = "failed"
        else:
            overall_status = "partial"

        return {
            "status": overall_status,
            "results": results,
            "message": f"Processed {len(results)} ID(s) for label '{label}'"
        }

    async def store(self, vertices: Dict[str, Any], edges: Dict[str, Any]) -> Dict[str, Any]:
        inserted_ids = []
        try:
            for label, df in (vertices or {}).items():
                for _, row in df.iterrows():
                    result = await self.add_vertex(label, row.to_dict())
                    if result["status"] == "success":
                        inserted_ids.append(result["data"])
            return {"status": "success", "data": inserted_ids}
        except Exception as e:
            logger.error(f"[Store] Batch insert failed", exc_info=e)
            return {"status": "error", "message": str(e)}

    async def _vertex_exists(self, label: str, vertex_id: str) -> bool:
        try:
            query = f"g.V({json.dumps(vertex_id)}).hasLabel('{label}').count()"
            result = await self.submit(query)
            return result and result[0] > 0
        except Exception as e:
            logger.error(f"[CheckExistence] Error checking vertex {vertex_id} of label '{label}'", exc_info=e)
            return False

    def _get_changed_fields(self, existing: Dict[str, Any], incoming: Dict[str, Any]) -> Dict[str, Any]:
        changed = {}
        for k, v in incoming.items():
            existing_val = existing.get(k)
            if isinstance(existing_val, list) and len(existing_val) == 1:
                existing_val = existing_val[0]
            if str(existing_val) != str(v):
                changed[k] = v
        return changed

    def _submit_sync(self, query: str, bindings: Dict[str, Any]) -> List[Any]:
        logger.debug(f"Executing Gremlin query: {query} | Bindings: {bindings}")
        result_set = self.client.submit(query, bindings)
        return result_set.all().result()

    def _format_properties(self, props: Dict[str, Any]) -> str:
        prop_parts = []
        for k, v in props.items():
            if isinstance(v, (dict, list)):
                logger.warning(f"[FormatProps] Skipping complex field '{k}' of type {type(v)}")
                continue
            if isinstance(v, str):
                v = json.dumps(v)
            prop_parts.append(f".property('{k}', {v})")
        return "".join(prop_parts)

    def _sanitize_update_properties(self, label: str, props: Dict[str, Any]) -> Dict[str, Any]:
        if "record" in props and isinstance(props["record"], dict):
            props = props["record"]

        model_cls = ENTITY_MODEL_MAP.get(label)
        if not model_cls:
            logger.warning(f"No model found for label '{label}' — skipping type coercion.")
            return {k: v for k, v in props.items() if not isinstance(v, (dict, list))}

        try:
            model_instance = model_cls(**props)
            return model_instance.dict(exclude_unset=True, exclude_none=True)
        except Exception as e:
            logger.error(f"Failed to sanitize properties using model '{label}': {e}")
            return {k: v for k, v in props.items() if not isinstance(v, (dict, list))}

    def _clean_results(self, raw: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        cleaned = []
        for item in raw:
            flat = {}
            for key, val in item.items():
                try:
                    if isinstance(val, list) and len(val) == 1:
                        flat[key] = str(val[0])
                    elif isinstance(val, (dict, list)):
                        flat[key] = json.dumps(val)
                    else:
                        flat[key] = str(val)
                except Exception as e:
                    logger.warning(f"[CleanResults] Skipping key '{key}' due to error: {e}", exc_info=e)
                    continue
            cleaned.append(flat)
        return cleaned
