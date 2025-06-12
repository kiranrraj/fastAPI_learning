import asyncio
from concurrent.futures import ThreadPoolExecutor
from gremlin_python.driver.client import Client
from gremlin_python.driver.serializer import GraphSONSerializersV2d0
from app.config import settings

_gremlin_client: Client | None = None
_executor = ThreadPoolExecutor(max_workers=1)

async def startup_gremlin() -> None:
    global _gremlin_client
    _gremlin_client = Client(
        settings.gremlin_url,
        settings.gremlin_source,
        message_serializer=GraphSONSerializersV2d0()
    )

async def shutdown_gremlin() -> None:
    global _gremlin_client
    if _gremlin_client:
        # close is synchronous
        _gremlin_client.close()
        _gremlin_client = None
        # optionally shutdown executor if no longer needed
        _executor.shutdown(wait=False)

def get_gremlin_client() -> Client:
    if _gremlin_client is None:
        raise RuntimeError("Gremlin client is not initialized")
    return _gremlin_client

# app/deps/gremlin_client.py
import asyncio
from concurrent.futures import ThreadPoolExecutor
from gremlin_python.driver.client import Client
from gremlin_python.driver.serializer import GraphSONSerializersV2d0
from app.config import settings

# module‐level client and executor
_gremlin_client: Client | None = None
_executor = ThreadPoolExecutor(max_workers=1)

async def startup_gremlin() -> None:
    """
    Initialize the Gremlin client on startup.
    """
    global _gremlin_client
    _gremlin_client = Client(
        settings.gremlin_url,
        settings.gremlin_source,
        message_serializer=GraphSONSerializersV2d0()
    )

async def shutdown_gremlin() -> None:
    """
    Close the Gremlin client on shutdown.
    """
    global _gremlin_client
    if _gremlin_client:
        # close is synchronous
        _gremlin_client.close()
        _gremlin_client = None
        # optionally shutdown executor if no longer needed
        _executor.shutdown(wait=False)

def get_gremlin_client() -> Client:
    """
    Dependency to retrieve the Gremlin client.
    """
    assert _gremlin_client is not None, "Gremlin client not initialized"
    return _gremlin_client

async def gremlin_query_async(gremlin_client: Client, query: str) -> list:
    def _run():
        rs = gremlin_client.submit(query)
        return rs.all().result()

    return await asyncio.get_running_loop().run_in_executor(_executor, _run)

