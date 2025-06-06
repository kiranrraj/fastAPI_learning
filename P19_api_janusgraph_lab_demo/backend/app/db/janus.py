# backend/app/db/janus.py

from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
from gremlin_python.structure.graph import Graph
from app.core.config import get_settings
from loguru import logger

settings = get_settings()
janus_client: DriverRemoteConnection | None = None

def init_janus_client():
    global janus_client
    try:
        janus_client = DriverRemoteConnection(settings.janusgraph_url, "g")
        logger.info("[JanusGraph] Connection established.")
    except Exception as e:
        logger.error(f"[JanusGraph] Connection failed: {e}")
        janus_client = None

def close_janus_client():
    global janus_client
    if janus_client:
        janus_client.close()
        logger.info("[JanusGraph] Connection closed.")
        janus_client = None

def janus_status() -> dict:
    try:
        g = Graph().traversal().withRemote(janus_client)
        g.V().limit(1).toList()  # Try a small query
        return {"status": "ok", "url": settings.janusgraph_url}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
