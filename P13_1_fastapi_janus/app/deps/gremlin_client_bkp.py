#!/usr/bin/env python3
import os
import sys
import json
import asyncio
from uuid import uuid4
from datetime import datetime

from gremlin_python.driver.client import Client as GremlinClient
from gremlin_python.driver.protocol import GremlinServerError

# ────────────────────────────────────────────────────────────────────────────────
# ### Important: EVENT-LOOP POLICY ON WINDOWS
# If running on Windows, the default "ProactorEventLoop" can raise WinError 87
# when the Gremlin driver tries to register its socket.
# Force Python to use the older SelectorEventLoop instead.
if os.name == "nt":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# ────────────────────────────────────────────────────────────────────────────────
# SINGLETON GREMLIN CLIENT
# We want exactly one WebSocket connection to JanusGraph alive for the entire
# lifetime of the app—so we store it in a module‐level variable.
_gremlin: GremlinClient | None = None

async def startup_gremlin():
    """
    Should be called once, at application startup.
    - If no client exists, create one pointed at GREMLIN_ENDPOINT. Avoids reconnecting on every request.
    """
    global _gremlin
    if _gremlin is None:
        # Read the endpoint from env (or default to localhost)
        url = os.getenv("GREMLIN_ENDPOINT", "ws://localhost:8182/gremlin")
        # Create the GremlinClient; 'g' is the traversal source name in gremlin-server.yaml
        _gremlin = GremlinClient(url, "g")
        print(f"[startup] Gremlin client created for {_gremlin._url}")

async def shutdown_gremlin():
    """
    Should be called once, at application shutdown. close() blocks on I/O, 
    so we offload it to a thread to avoid hanging the main asyncio loop.
    """
    global _gremlin
    if _gremlin:
        # Offload to thread because .close() can block
        await asyncio.to_thread(_gremlin.close)
        print("[shutdown] Gremlin client closed.")
        _gremlin = None

# GRAPH SERVICE: ASYNC CRUD WRAPPER
#   
# class presents a async interface for:
#   - add_vertex
#   - get_vertex
#   - list_vertices
#   - update_vertex
#   - delete_vertex
#
# Important: We reuses the singleton _gremlin client, 
# but wraps each blocking call in asyncio.to_thread so Uvicorn’s loop stays responsive.
class GraphService:
    def __init__(self):
        # Ensure the singleton was initialized on startup
        if _gremlin is None:
            raise RuntimeError("Gremlin client not initialized (did you call startup_gremlin?)")
        self.client = _gremlin

    async def add_vertex(self, label: str, properties: dict) -> str:
        """
        1) Generate a UUID for this new vertex.
        2) Stamp it with a created_at ISO timestamp.
        3) Merge in user props, build a Gremlin addV() script.
        4) Offload the blocking .submitAsync().result() to a thread.
        """
        vid = str(uuid4())
        created_ts = datetime.utcnow().isoformat()
        # Merge id and created_at into the property dict
        props = {"id": vid, "created_at": created_ts, **properties}

        # Build the Gremlin traversal string
        gremlin = "g.addV('" + label + "')"
        for k, v in props.items():
            gremlin += f".property('{k}',{json.dumps(v)})"

        # The blocking work: send the script and wait for the result
        def blocking_add():
            return self.client.submitAsync(gremlin).result()

        # Run the blocking call in a thread
        await asyncio.to_thread(blocking_add)
        return vid

    async def get_vertex(self, label: str, id: str) -> dict | None:
        """
        Retrieve one vertex by ID and label. 
        Uses elementMap() to return all properties as a flat map.
        """
        gremlin = f"g.V('{id}').hasLabel('{label}').elementMap()"

        def blocking_get():
            # submitAsync().result() blocks and gives a ResultSet
            rs = self.client.submitAsync(gremlin).result()
            # extract all rows
            return rs.all().result()

        rows = await asyncio.to_thread(blocking_get)
        if not rows:
            return None
        # rows[0] is a Map, so convert to a Python dict
        return dict(rows[0])

    async def list_vertices(self, label: str, limit: int, offset: int, filters: dict) -> list[dict]:
        """
        Return a page of vertices by label.
        """
        gremlin = (
            f"g.V().hasLabel('{label}')"
            f".range({offset},{offset+limit})"
            ".elementMap()"
        )

        def blocking_list():
            rs = self.client.submitAsync(gremlin).result()
            return rs.all().result()

        rows = await asyncio.to_thread(blocking_list)
        # Convert each return to a plain dict
        return [dict(r) for r in rows]

    async def update_vertex(self, label: str, id: str, properties: dict) -> bool:
        """
        Set new properties on an existing vertex.
        If properties is empty, success set to True.
        """
        if not properties:
            return True

        gremlin = f"g.V('{id}').hasLabel('{label}')"
        for k, v in properties.items():
            gremlin += f".property('{k}',{json.dumps(v)})"

        def blocking_update():
            return self.client.submitAsync(gremlin).result()

        try:
            await asyncio.to_thread(blocking_update)
            return True
        except GremlinServerError:
            return False

    async def delete_vertex(self, label: str, id: str) -> bool:
        """
        Remove a vertex, returns True on success
        """
        gremlin = f"g.V('{id}').hasLabel('{label}').drop()"

        def blocking_delete():
            return self.client.submitAsync(gremlin).result()

        try:
            await asyncio.to_thread(blocking_delete)
            return True
        except GremlinServerError:
            return False


# FASTAPI DEPENDENCY FUNCTION
#
# When you write client=Depends(get_gremlin_client) in a route, FastAPI calls this 
# function to produce a fresh GraphService instance ,wrapping the shared _gremlin connection.
#
# Important: We do NOT annotate the return type, otherwise FastAPI might try to
# treat GraphService as a Pydantic model.
def get_gremlin_client():
    return GraphService()
