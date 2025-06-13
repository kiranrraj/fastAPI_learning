# app/deps/gremlin_client.py

import asyncio
from concurrent.futures import ThreadPoolExecutor
from gremlin_python.driver.client import Client
from gremlin_python.driver.serializer import GraphSONSerializersV2d0
from app.config import settings

# module‐level client and executor
# underscore says this is a internal variable and not intended for direct external access.
_gremlin_client: Client | None = None
_executor = ThreadPoolExecutor(max_workers=1)

# Initialize the Gremlin client on startup.
# asynchronous function is designed to be called once when your application starts up
async def startup_gremlin() -> None:
    global _gremlin_client
    _gremlin_client = Client(
        settings.gremlin_url,
        settings.gremlin_source,
        message_serializer=GraphSONSerializersV2d0()
    )

# Close the Gremlin client on shutdown.
# This asynchronous function is designed to be called once when your application is shutting
async def shutdown_gremlin() -> None:
    global _gremlin_client
    if _gremlin_client:
        # close is synchronous
        _gremlin_client.close()
        _gremlin_client = None
        # optionally shutdown executor if no longer needed
        # wait=False: This means the shutdown will happen 
        # immediately without waiting for any pending tasks to complete. 
        _executor.shutdown(wait=False)

# Dependency to retrieve the Gremlin client.
# This synchronous function acts as a dependency injector for the Gremlin 
# client. It's intended to be used by other parts of your application 
# to get access to the initialized Gremlin client.
def get_gremlin_client() -> Client:
    assert _gremlin_client is not None, "Gremlin client not initialized"
    return _gremlin_client

# This asynchronous function provides a convenient way to execute 
# Gremlin queries in a non-blocking manner.
async def gremlin_query_async(gremlin_client: Client, query: str) -> list:
    def _run():
        # Submits the Gremlin query to the server. 
        rs = gremlin_client.submit(query)
        # rs.all(): This method on the ResultSet returns a Future 
        # (from gremlin_python's internal async handling) that will 
        # eventually contain all the results from the query.
        # .result(): This blocks until the Future is complete and all 
        # results are available. This is another blocking operation.
        return rs.all().result()

    return await asyncio.get_running_loop().run_in_executor(_executor, _run)