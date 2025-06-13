from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app.schemas.patient import (
    PatientCreate,
    PatientRead,
    PatientUpdate,
)
from app.gremlin_client import get_gremlin_client, GremlinClient

router = APIRouter(prefix="/patients", tags=["patients"])

@router.post(
    "", 
    response_model=PatientRead, 
    status_code=status.HTTP_201_CREATED
)
async def create_patient(
    payload: PatientCreate,
    client: GremlinClient = Depends(get_gremlin_client),
):
    """
    Create a new Patient vertex.
    """
    # 1) Generate a new UUID (or let Gremlin do it server-side)
    # 2) Build a Gremlin query to add a vertex with label 'Patient' and properties payload.dict()
    # 3) Execute, fetch the created vertex, and return as PatientRead
    ...

@router.get(
    "/{patient_id}",
    response_model=PatientRead,
    responses={404: {"description": "Patient not found"}},
)
async def get_patient(
    patient_id: UUID,
    client: GremlinClient = Depends(get_gremlin_client),
):
    """
    Fetch one Patient by UUID.
    """
    ...

@router.get(
    "",
    response_model=List[PatientRead],
)
async def list_patients(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    created_after: Optional[str] = Query(None),
    client: GremlinClient = Depends(get_gremlin_client),
):
    """
    List patients, with optional pagination and filters.
    """
    ...

@router.put(
    "/{patient_id}",
    response_model=PatientRead,
    responses={404: {"description": "Patient not found"}},
)
async def update_patient(
    patient_id: UUID,
    payload: PatientUpdate,
    client: GremlinClient = Depends(get_gremlin_client),
):
    """
    Update an existing Patient. Only fields provided in the payload will change.
    """
    ...

@router.delete(
    "/{patient_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={404: {"description": "Patient not found"}},
)
async def delete_patient(
    patient_id: UUID,
    client: GremlinClient = Depends(get_gremlin_client),
):
    """
    Delete a Patient vertex by UUID.
    """
    ...
