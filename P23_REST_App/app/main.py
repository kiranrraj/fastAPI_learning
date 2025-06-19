# labx_app/main.py

from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.labx_rest_register import labx_rest_register_service
from app.core.labx_context import LabXContext
from app.core.labx_graph_janus import LabXGraphJanus
from app.logger import get_logger
from app.config import config
from app.api.labx_router import router as labx_router
from fastapi.middleware.cors import CORSMiddleware

logger = get_logger("labx-logger")

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        logger.info("Starting LabX app and initializing context...")
        graph = await LabXGraphJanus.create()
        context = LabXContext(graph=graph)
        app.state.context = context
        labx_rest_register_service(app, "/labx/entity", context)
        logger.info("LabX context initialized")
        yield
    except Exception as e:
        logger.error(f"[Startup] LabX initialization failed", exc_info=e)
        raise
    finally:
        logger.info("Shutting down LabX app...")
        try:
            if hasattr(app.state, "context") and hasattr(app.state.context, "graph"):
                await app.state.context.graph.close()
            logger.info("Shutdown complete.")
        except Exception as e:
            logger.error("[Shutdown] Error while closing graph connection", exc_info=e)

app = FastAPI(
    title="LabX Graph API",
    version="1.0.0",
    debug=config.debug,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(labx_router, prefix="/labx")

@app.get("/")
def health_check():
    return {"status": "LabX API running", "version": "1.0.0"}
