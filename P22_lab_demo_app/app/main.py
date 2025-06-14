import os
import logger
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Application starting")
    await start_gremlin()
    print("Application started")
    yield
    print("Shutting down the application")
    await shutdown_gremlin()
    print("Shutdown completed.")

app = FastAPI(
    title="LabXApp",
    version="1.0.0",
    lifespan=lifespan,
    openapi_url="/labx/openapi.json",
    docs_url="/labx/docs"
)
