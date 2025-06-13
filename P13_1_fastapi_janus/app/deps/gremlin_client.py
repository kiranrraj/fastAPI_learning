import os
import json                     # to serialize Python values into JSON literals
import asyncio                  # for to_thread and async/await
from uuid import uuid4         # to generate random UUIDs
from datetime import datetime  # to timestamp new vertices
from gremlin_python.driver.client import Client as GremlinClient
from gremlin_python.driver.protocol import GremlinServerError

# ── Raw Gremlin driver client singleton ──
# We store a single GremlinClient instance in module scope so that
# we reuse the same connection for every request.
_gremlin: GremlinClient | None = None

async def startup_gremlin():
    """
    Called once on FastAPI startup.
    - Initializes `_gremlin` if not already created.
    - Uses the GREMLIN_ENDPOINT env var or defaults to ws://localhost:8182/gremlin.
    """
    global _gremlin
    if _gremlin is None:
        _gremlin = GremlinClient(
            os.getenv("GREMLIN_ENDPOINT", "ws://localhost:8182/gremlin"),
            "g"  # use the 'g' traversal source defined in the Gremlin server
        )
        print(f"Gremlin client created for {_gremlin._url}")

async def shutdown_gremlin():
    """
    Called on FastAPI shutdown.
    - Closes the GremlinClient.
    - `.close()` is blocking and internally spins its own event loop,
      so we offload it into a thread with asyncio.to_thread().
    """
    global _gremlin
    if _gremlin:
        # Offload the blocking .close() call to a separate thread
        await asyncio.to_thread(_gremlin.close)
        print("Gremlin client closed.")
        _gremlin = None


# ── GraphService: our high‐level CRUD wrapper ──
class GraphService:
    """
    Provides asynchronous CRUD operations over JanusGraph via Gremlin.
    All blocking calls against the Gremlin driver are wrapped in
    asyncio.to_thread to avoid conflicts with Uvicorn’s event loop.
    """

    def __init__(self):
        # Ensure startup_gremlin() has run
        if _gremlin is None:
            raise RuntimeError("Gremlin client not initialized")
        self.client = _gremlin

    async def add_vertex(self, label: str, properties: dict) -> str:
        """
        Create a new vertex:

        - Generate a new UUID4 string for `id`.
        - Add a `created_at` ISO timestamp.
        - Merge in any user-provided properties.

        Returns:
            The generated UUID string (so callers know the new vertex’s id).
        """
        # 1) Create a UUID for this node and record the UTC time
        vid = str(uuid4())
        created_ts = datetime.utcnow().isoformat()
        props = {"id": vid, "created_at": created_ts, **properties}

        # 2) Build a Gremlin script: g.addV('Label')
        #    then for each property: .property('key', <json-encoded value>)
        gremlin = "".join(
            [f"g.addV('{label}')"] +
            [f".property('{k}',{json.dumps(v)})" for k, v in props.items()]
        )

        # 3) The gremlin_python driver’s submitAsync().result() is blocking
        #    and spins its own event loop. We cannot call that on the main
        #    Uvicorn loop, so we push it into a thread.
        def blocking_add():
            return self.client.submitAsync(gremlin).result()

        await asyncio.to_thread(blocking_add)
        return vid

    async def get_vertex(self, label: str, id: str) -> dict | None:
        """
        Fetch one vertex by label and id:

        - Uses `elementMap()` to retrieve all properties as a flat map.
        - Returns None if no matching vertex is found.
        """
        gremlin = f"g.V('{id}').hasLabel('{label}').elementMap()"

        def blocking_get():
            result = self.client.submitAsync(gremlin).result()
            # .all() returns a List<Map<Object,Object>>
            # return result.all()
            return result.all().result() 

        rows = await asyncio.to_thread(blocking_get)
        if not rows:
            return None
        # rows[0] is a map: {'id': '...', 'first_name': 'Alice', ...}
        return dict(rows[0])

    async def list_vertices(
        self,
        label: str,
        limit: int,
        offset: int,
        filters: dict
    ) -> list[dict]:
        """
        List vertices of a given label, paginated by offset+limit.
        (We ignore `filters` for now, but you can extend this by
         dynamically inserting `.has('key', value)` steps.)
        """
        gremlin = (
            f"g.V().hasLabel('{label}')"
            f".range({offset},{offset+limit})"
            ".elementMap()"
        )

        def blocking_list():
            result = self.client.submitAsync(gremlin).result()
            # return result.all()
            return result.all().result()

        rows = await asyncio.to_thread(blocking_list)
        # Convert each row (Map) into a Python dict
        return [dict(r) for r in rows]

    async def update_vertex(
        self,
        label: str,
        id: str,
        properties: dict
    ) -> bool:
        """
        Update specific properties on an existing vertex.
        Returns True on success, False if GremlinServerError is raised.
        """
        if not properties:
            # Nothing to update
            return True

        gremlin = "".join(
            [f"g.V('{id}').hasLabel('{label}')"] +
            [f".property('{k}',{json.dumps(v)})" for k, v in properties.items()]
        )

        def blocking_update():
            return self.client.submitAsync(gremlin).result()

        try:
            await asyncio.to_thread(blocking_update)
            return True
        except GremlinServerError:
            return False

    async def delete_vertex(self, label: str, id: str) -> bool:
        """
        Delete the vertex with the given label and id.
        Returns True on success, False on GremlinServerError.
        """
        gremlin = f"g.V('{id}').hasLabel('{label}').drop()"

        def blocking_delete():
            return self.client.submitAsync(gremlin).result()

        try:
            await asyncio.to_thread(blocking_delete)
            return True
        except GremlinServerError:
            return False


# ── FastAPI dependency ──
def get_gremlin_client():
    """
    Provides a fresh GraphService for each request via dependency injection.
    **No return‐type annotation**: prevents FastAPI from trying to
    treat GraphService as a Pydantic model at startup.
    """
    return GraphService()
