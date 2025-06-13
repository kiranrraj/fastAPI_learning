# app/main.py

from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.client.gremlin_engine import startup_gremlin, shutdown_gremlin
from app.routes.labrest_router  import router as labrest_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1) This block runs before the app starts serving any requests:
    await startup_gremlin()
    # Now your single GremlinClient is open and ready to use.
    yield
    # 2) Once the application is shutting down (e.g. you hit CTRL+C),
    #    execution continues here to clean up:
    await shutdown_gremlin()

# Pass our lifespan manager into FastAPI
app = FastAPI(
    title="Generic LabRest API",
    lifespan=lifespan,
)

# All LabRest endpoints live under /api/v1
app.include_router(labrest_router, prefix="/api/v1")
