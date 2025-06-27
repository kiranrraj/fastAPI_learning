# app/main.py

from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.api.proxy import router as proxy
from app.api import user, auth
from app.core.logger import get_logger
from app.core.config import settings
from app.db.connection import get_client, close_client

logger = get_logger("main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        get_client()
        logger.info(" MongoDB connection opened")
        yield
    except Exception as e:
        logger.critical(f" Unexpected error during app lifespan: {e}")
        raise
    finally:
        close_client()
        logger.info(" MongoDB connection closed")

app = FastAPI(
    title=settings.model_config.get("env_file", "AuthApp"),
    lifespan=lifespan
)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "AuthApp FastAPI is running."}

# Register user routes

app.include_router(auth.router)
app.include_router(proxy)
app.include_router(user.router)

