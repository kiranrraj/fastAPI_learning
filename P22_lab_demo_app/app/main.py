import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.routes.graph import router as graph_router
from app.gremlin_client import start_gremlin, shutdown_gremlin
from app.routes.health import router as health_router
from app.routes.entity import router as entity_router

# HTTP ERROr Handlers
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.handlers import error_handlers

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

# HTTP ERROR Handling 
app.add_exception_handler(StarletteHTTPException, error_handlers.custom_http_exception_handler)
app.add_exception_handler(RequestValidationError, error_handlers.custom_validation_exception_handler)
app.add_exception_handler(Exception, error_handlers.internal_server_error_handler)
###

app.include_router(graph_router)
app.include_router(health_router)
app.include_router(entity_router)