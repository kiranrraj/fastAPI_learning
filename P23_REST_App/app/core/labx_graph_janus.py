# labx_app/core/labx_graph_janus.py

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
        if self.client:
            self.client.close()
            logger.info("Closed JanusGraph client connection")

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
            query = f"g.addV('{label}'){prop_string}"
            results = await self.submit(query)
            return str(results[0].id) if results else ""
        except Exception as e:
            logger.error(f"Failed to add vertex '{label}': {e}")
            raise VertexInsertError(f"Vertex insert failed: {e}")

    async def query_vertices(self, label: str, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        try:
            query = f"g.V().hasLabel('{label}')"
            if filters:
                for k, v in filters.items():
                    query += f".has('{k}', {json.dumps(v)})"
            query += ".valueMap(true)"
            result = await self.submit(query)
            return self._clean_results(result)
        except Exception as e:
            logger.error(f"Vertex query failed for label '{label}': {e}")
            raise

    async def delete_vertices(self, label: str, filters: Dict[str, Any] = None) -> int:
        try:
            query = f"g.V().hasLabel('{label}')"
            if filters:
                for k, v in filters.items():
                    query += f".has('{k}', {json.dumps(v)})"
            query += ".drop()"
            await self.submit(query)
            return 1
        except Exception as e:
            logger.error(f"Failed to delete vertices of label '{label}': {e}")
            raise

    async def store(self, vertices: Dict[str, Any], edges: Dict[str, Any]) -> bool:
        try:
            # Very basic placeholder for demo — will evolve per your DF input
            for label, df in (vertices or {}).items():
                for _, row in df.iterrows():
                    await self.add_vertex(label, row.to_dict())
            return True
        except Exception as e:
            logger.error(f"Store failed: {e}")
            return False

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
