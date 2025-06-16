# labx_app/main.py

from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.core.labx_context import LabXContext
from app.core.labx_graph_janus import LabXGraphJanus
from app.logger import get_logger
from app.config import config
from app.api.labx_router import router as labx_router

logger = get_logger("labx-main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        logger.info("Starting LabX app and initializing context...")
        graph = await LabXGraphJanus.create()
        context = LabXContext(graph=graph)
        app.state.context = context
        logger.info("LabX context initialized")
        yield
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise
    finally:
        logger.info("Shutting down LabX app...")
        if hasattr(app.state, "context") and hasattr(app.state.context, "graph"):
            await app.state.context.graph.close()
        logger.info("Shutdown complete.")

app = FastAPI(
    title="LabX Graph API",
    version="1.0.0",
    debug=config.debug,
    lifespan=lifespan
)

# Mount all routers
app.include_router(labx_router, prefix="/labx")

# Optional root
@app.get("/")
def health_check():
    return {"status": "LabX API running", "version": "1.0.0"}
