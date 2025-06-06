# app/main.py

from fastapi import FastAPI
from contextlib import asynccontextmanager
from loguru import logger

from app.core.config import get_settings
from app.core.logger import setup_logging
from app.db.mongo import init_mongo, close_mongo
from app.db.janus import init_janus_client, close_janus_client
from app.api.routes import register_routers

from app.__version__ import (
    __title__, __description__, __version__, __author__, __email__, __license__
)


settings = get_settings()

# --------------------------
# LIFESPAN HANDLER
# --------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"[LIFESPAN] Startup: ENV loaded = {settings.env}")
    
    setup_logging()         # Setup file & console logging
    init_mongo()            # Connect to MongoDB
    init_janus_client()     # Connect to JanusGraph

    yield                   # Yield control to app

    logger.info("[LIFESPAN] Shutting down...")
    close_mongo()
    close_janus_client()
    logger.info("[LIFESPAN] Shutdown complete.")

# --------------------------
# FASTAPI INSTANCE
# --------------------------
app = FastAPI(
    title=__title__,
    version=__version__,
    description=__description__,
    contact={"name": __author__, "email": __email__},
    license_info={"name": __license__, "url": "https://opensource.org/licenses/MIT"},
    lifespan=lifespan,
)

# --------------------------
# REGISTER ROUTERS
# --------------------------

register_routers(app)
