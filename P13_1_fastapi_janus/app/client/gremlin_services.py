import json
import asyncio
from uuid import uuid4
from datetime import datetime

from gremlin_python.driver.protocol import GremlinServerError
from .gremlin_engine import get_raw_client

class GraphService:
    """
    Async CRUD operations over JanusGraph via Gremlin.
    Wraps the raw singleton client in user-friendly methods.
    """

    def __init__(self):
        # Grab the already-initialized GremlinClient
        self.client = get_raw_client()

    async def add_vertex(self, label: str, properties: dict) -> str:
        vid = str(uuid4())
        created_ts = datetime.utcnow().isoformat()
        props = {"id": vid, "created_at": created_ts, **properties}

        gremlin = "g.addV('" + label + "')"
        for k, v in props.items():
            gremlin += f".property('{k}',{json.dumps(v)})"

        def _block():
            return self.client.submitAsync(gremlin).result()

        await asyncio.to_thread(_block)
        return vid

    async def get_vertex(self, label: str, id: str) -> dict | None:
        gremlin = f"g.V('{id}').hasLabel('{label}').elementMap()"

        def _block():
            rs = self.client.submitAsync(gremlin).result()
            return rs.all().result()

        rows = await asyncio.to_thread(_block)
        return dict(rows[0]) if rows else None

    async def list_vertices(
        self, label: str, limit: int, offset: int, filters: dict
    ) -> list[dict]:
        gremlin = (
            f"g.V().hasLabel('{label}')"
            f".range({offset},{offset+limit})"
            ".elementMap()"
        )

        def _block():
            rs = self.client.submitAsync(gremlin).result()
            return rs.all().result()

        rows = await asyncio.to_thread(_block)
        return [dict(r) for r in rows]

    async def update_vertex(
        self, label: str, id: str, properties: dict
    ) -> bool:
        if not properties:
            return True

        gremlin = f"g.V('{id}').hasLabel('{label}')"
        for k, v in properties.items():
            gremlin += f".property('{k}',{json.dumps(v)})"

        def _block():
            return self.client.submitAsync(gremlin).result()

        try:
            await asyncio.to_thread(_block)
            return True
        except GremlinServerError:
            return False

    async def delete_vertex(self, label: str, id: str) -> bool:
        gremlin = f"g.V('{id}').hasLabel('{label}').drop()"

        def _block():
            return self.client.submitAsync(gremlin).result()

        try:
            await asyncio.to_thread(_block)
            return True
        except GremlinServerError:
            return False


def get_gremlin_client():
    """
    FastAPI dependency: returns a fresh GraphService per request,
    reusing the underlying GremlinClient.
    """
    return GraphService()
