from fastapi import APIRouter
from app.routers.factory import make_crud_router
from app.schemas.patient import PatientCreate, PatientRead, PatientUpdate

router = make_crud_router(
    prefix="/patients",
    tag="patients",
    vertex_label="Patient",
    create_schema=PatientCreate,
    read_schema=PatientRead,
    update_schema=PatientUpdate,
)
