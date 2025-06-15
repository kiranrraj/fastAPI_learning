# app/gremlin_client.py

from gremlin_python.driver import client, serializer
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

async def shutdown_gremlin():
    global gremlin_client 
    if gremlin_client:
        logger.info("Closing connection to gremlin.")
        try:
            await gremlin_client.close()
        except Exception as e:
            logger.error(f"Error during Gremlin shutdown: {e}")
        finally:
            gremlin_client = None


def get_gremlin_client():
    if not gremlin_client:
        raise RuntimeError("Gremlin client not initialized. Call start_gremlin() first.")
    return gremlin_client