import os
from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.deps.gremlin_client import startup_gremlin, shutdown_gremlin
from app.routers.factory import make_crud_router
from app.schemas.patient import PatientCreate, PatientRead, PatientUpdate
from app.routers.patients import router as patients_router



@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up Gremlin…")
    await startup_gremlin()
    print("Gremlin started.")
    yield
    print("Shutting down Gremlin…")
    await shutdown_gremlin()
    print("Gremlin shut down.")

app = FastAPI(
    title="Lab Graph API",
    version="1.0.0",
    lifespan=lifespan,
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
)

# === Patients CRUD ===
patients_router = make_crud_router(
    prefix="/patients",
    tag="patients",
    vertex_label="Patient",
    create_schema=PatientCreate,
    read_schema=PatientRead,
    update_schema=PatientUpdate,
)
app.include_router(patients_router, prefix="/api/v1")
