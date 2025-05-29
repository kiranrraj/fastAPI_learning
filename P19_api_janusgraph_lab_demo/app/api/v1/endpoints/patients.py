from fastapi import APIRouter, HTTPException
from uuid import UUID, uuid4
import logging
from app.models.patient import Patient, PatientCreate

router = APIRouter()
logger = logging.getLogger("lab_app")

# In memory db, for testing
patients_db: dict[UUID, Patient] = {}

@router.post(
    "/patients", 
    response_model=Patient,
    tags=["Patients"]
)
def create_patient(patient_data: PatientCreate):
    """
    Create a new patient entry. Accepts a PatientCreate object (no ID),
    generates a new UUID, and returns the complete Patient model (with ID).
    """

    # Convert input model to dictionary, add UUID, then create a full Patient instance
    new_patient = Patient(**patient_data.model_dump(), id=uuid4())
    
    if new_patient.id in patients_db:
        raise HTTPException(
            status_code=400,
            detail="Patient with this ID already exists"
        )
    # Store new patient in the in-memory DB
    patients_db[new_patient.id] = new_patient
    logger.info(f"Patient created: {new_patient.id}")
    return new_patient