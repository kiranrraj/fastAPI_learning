import os
import json
from uuid import UUID
from gremlin_python.driver.client import Client as GremlinClient

# ── Raw Gremlin driver client ──
_gremlin: GremlinClient | None = None

async def startup_gremlin():
    global _gremlin
    if _gremlin is None:
        _gremlin = GremlinClient(
            os.getenv("GREMLIN_ENDPOINT", "ws://localhost:8182/gremlin"),
            "g"
        )
        print(f"Gremlin client created for {_gremlin._url}")

async def shutdown_gremlin():
    global _gremlin
    if _gremlin:
        try:
            _gremlin.close()
            print("Gremlin client closed.")
        except:
            pass
        _gremlin = None

# ── File-backed stub implementations ──
_DATA_CACHE: dict[str, list[dict]] = {}

def _load_data(entity: str) -> list[dict]:
    """
    Load and cache the JSON array from app/data/{entity}.json
    """
    if entity not in _DATA_CACHE:
        base = os.path.dirname(__file__)
        path = os.path.join(base, "..", "data", f"{entity}.json")
        with open(path, "r", encoding="utf-8") as f:
            _DATA_CACHE[entity] = json.load(f)
    return _DATA_CACHE[entity]

async def _stub_get_vertex(label: str, id: str) -> dict | None:
    data = _load_data(label.lower() + "s")
    return next((item for item in data if item["id"] == id), None)

async def _stub_list_vertices(label: str, limit: int, offset: int, filters: dict) -> list[dict]:
    data = _load_data(label.lower() + "s")
    return data[offset: offset + limit]

# ── Service wrapper ──
class GraphService:
    """
    Provides the methods the routers expect.
    """

    async def get_vertex(self, label: str, id: str) -> dict | None:
        return await _stub_get_vertex(label, id)

    async def list_vertices(self, label: str, limit: int, offset: int, filters: dict) -> list[dict]:
        return await _stub_list_vertices(label, limit, offset, filters)

    async def add_vertex(self, label: str, properties: dict) -> str:
        raise NotImplementedError("Create not supported in stub")

    async def update_vertex(self, label: str, id: str, properties: dict) -> bool:
        raise NotImplementedError("Update not supported in stub")

    async def delete_vertex(self, label: str, id: str) -> bool:
        raise NotImplementedError("Delete not supported in stub")

# ── Dependency for FastAPI ──
def get_gremlin_client() -> GraphService:
    """
    Returns a GraphService instance to your routes.
    """
    if _gremlin is None:
        raise RuntimeError("Gremlin client not initialized")
    return GraphService()
