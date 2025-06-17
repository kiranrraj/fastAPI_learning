# labx_app/core/labx_graph_janus.py
# copy

from gremlin_python.driver.client import Client
import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import Any, Dict, List
from app.config import config
from app.logger import get_logger
from app.exceptions import GraphConnectionError, VertexInsertError
import json

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
            # Properly close aiohttp transport
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

    async def add_vertex(self, label: str, properties: Dict[str, Any]) -> str:
        try:
            prop_string = self._format_properties(properties)
            query = f"g.addV('{label}'){prop_string}.id()"  # Only return the ID
            logger.debug(f"[AddVertex] Executing query: {query} | Properties: {properties}")

            results = await self.submit(query)

            if results and isinstance(results, list) and len(results) > 0:
                return str(results[0])
            else:
                logger.warning(f"[AddVertex] No result returned for vertex insert: label='{label}', properties={properties}")
                raise VertexInsertError("Vertex insert returned empty result.")

        except Exception as e:
            logger.error(f"[AddVertex] Failed to add vertex '{label}' with properties={properties}", exc_info=e)
            raise VertexInsertError(f"Vertex insert failed: {e}")

    async def query_vertices(
        self,
        label: str,
        filters: Dict[str, Any] = None,
        limit: int = None,
        skip: int = None
    ) -> List[Dict[str, Any]]:
        """
        Query vertices from JanusGraph with optional filters, limit, and skip.
        Supports pagination via Gremlin's .range(start, end).
        """
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

            logger.debug(f"Executing Gremlin query: {query} | Bindings: {{}}")
            result = await self.submit(query)

            return self._clean_results(result)

        except Exception as e:
            logger.error(f"Vertex query failed for label '{label}' with filters={filters}, limit={limit}, skip={skip}: {e}")
            raise RuntimeError(f"Graph query error: {str(e)}") from e


    async def delete_vertices(self, label: str, ids: List[str]) -> Dict[str, Any]:
        results = []

        for id_ in ids:
            try:
                check_query = f"g.V({id_}).hasLabel('{label}').count()"
                result = await self.submit(check_query)

                if not result or result[0] == 0:
                    logger.warning(f"[Delete] Vertex ID {id_} of label '{label}' not found.")
                    results.append({"id": id_, "status": "not_found", "message": "ID not found"})
                    continue

                delete_query = f"g.V({id_}).hasLabel('{label}').drop()"
                logger.debug(f"[DeleteVertex] Executing query: {delete_query}")
                await self.submit(delete_query)
                results.append({"id": id_, "status": "deleted", "message": "Deleted successfully"})

            except Exception as e:
                logger.warning(f"[Delete] Failed for ID {id_}: {e}")
                results.append({"id": id_, "status": "error", "message": str(e)})

        overall_status = "success"
        if all(r["status"] == "not_found" for r in results):
            overall_status = "failed"
        elif any(r["status"] == "not_found" or r["status"] == "error" for r in results):
            overall_status = "partial"

        return {
            "status": overall_status,
            "results": results,
            "message": f"Processed {len(results)} ID(s) for label '{label}'"
        }


    async def store(self, vertices: Dict[str, Any], edges: Dict[str, Any]) -> List[str]:
        inserted_ids = []
        try:
            for label, df in (vertices or {}).items():
                for _, row in df.iterrows():
                    inserted_id = await self.add_vertex(label, row.to_dict())
                    if inserted_id:
                        inserted_ids.append(inserted_id)
            return inserted_ids  # List of inserted vertex ids
        except Exception as e:
            logger.error(f"Store failed: {e}")
            return []


    def _format_properties(self, props: Dict[str, Any]) -> str:
        prop_parts = []
        for k, v in props.items():
            if isinstance(v, str):
                v = json.dumps(v)
            prop_parts.append(f".property('{k}', {v})")
        return "".join(prop_parts)

    def _clean_results(self, raw: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        cleaned = []
        for item in raw:
            flat = {}
            for key, val in item.items():
                if isinstance(val, list) and len(val) == 1:
                    flat[key] = val[0]
                else:
                    flat[key] = val
            cleaned.append(flat)
        return cleaned
