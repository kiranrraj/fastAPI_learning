import os
import asyncio
from gremlin_python.driver.client import Client as GremlinClient

# Singleton raw GremlinClient 
_gremlin: GremlinClient | None = None

async def startup_gremlin():
    """
    Initialize the single GremlinClient at application startup.
    """
    global _gremlin
    if _gremlin is None:
        url = os.getenv("GREMLIN_ENDPOINT", "ws://localhost:8182/gremlin")
        _gremlin = GremlinClient(url, "g")
        print(f"[startup] Gremlin client created for {_gremlin._url}")

async def shutdown_gremlin():
    """
    Close the GremlinClient cleanly at application shutdown.
    """
    global _gremlin
    if _gremlin:
        # .close() can block on I/O, so offload to a thread
        await asyncio.to_thread(_gremlin.close)
        print("[shutdown] Gremlin client closed.")
        _gremlin = None

def get_raw_client() -> GremlinClient:
    """
    Return the singleton GremlinClient.
    Raises if startup_gremlin() hasn’t been called yet.
    """
    if _gremlin is None:
        raise RuntimeError("Gremlin client not initialized—did you call startup_gremlin()?")  
    return _gremlin
