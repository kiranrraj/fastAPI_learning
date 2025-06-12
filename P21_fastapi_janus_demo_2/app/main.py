# app/main.py

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.deps.gremlin_client import startup_gremlin, shutdown_gremlin
from app.routers.health import router as health_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    await startup_gremlin()
    yield

    # shutdown
    await shutdown_gremlin()

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="")

@app.get("/", response_model=dict, tags=["Root"])
async def root():
    return {"message": f"{settings.app_name} is up and running!"}