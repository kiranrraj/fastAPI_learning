# app/gremlin_client.py

import asyncio
from gremlin_python.driver import client, serializer
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
from gremlin_python.process.anonymous_traversal import traversal
from gremlin_python.process.graph_traversal import GraphTraversalSource

from app.config import settings
from app.logger import logger

# Important ==> RuntimeError: Cannot run the event loop while another loop is running
from gremlin_python.driver.aiohttp.transport import AiohttpTransport

gremlin_client = None

async def start_gremlin():
    global gremlin_client
    logger.info("Connecting to Gremlin server...")
    gremlin_client = client.Client(
        url = settings.gremlin_url,
        traversal_source = "g",
        transport_factory=lambda: AiohttpTransport(),
        message_serializer=serializer.GraphSONSerializersV2d0()
    )
    logger.info("Connected to Gremlin.")

async def ping_gremlin():
    try:
        result = await asyncio.to_thread(
            lambda: gremlin_client.submit("g.V().limit(1)").all().result()
        )
        return True
    except Exception as e:
        logger.error(f"Gremlin health check failed: {e}")
        return False


async def shutdown_gremlin():
    global gremlin_client 
    if gremlin_client:
        logger.info("Closing connection to gremlin.")
        try:
            gremlin_client.close()
        except Exception as e:
            logger.error(f"Error during Gremlin shutdown: {e}")
        finally:
            gremlin_client = None


def get_gremlin_client():
    if not gremlin_client:
        raise RuntimeError("Gremlin client not initialized. Call start_gremlin() first.")
    return gremlin_client

def get_gremlin_traversal() -> GraphTraversalSource:
    connection = DriverRemoteConnection("ws://localhost:8182/gremlin", "g")

    return traversal().withRemote(connection)
