# app/api/v1/endpoints/patients.py
from fastapi import APIRouter, HTTPException
import logging
from app.models.patient import Patient, PatientCreate
from uuid import UUID
from typing import Dict
from app.db.memory import patients_db

router = APIRouter()
logger = logging.getLogger("lab_app")

@router.post(
    "/patient",
    response_model=Patient,
    tags=["Patients"]
)
def create_patient(patient_data: PatientCreate):
    new_patient = Patient(**patient_data.model_dump())

    if new_patient.id in patients_db:
        raise HTTPException(status_code=400, detail="Patient with this ID already exists")

    patients_db[new_patient.id] = new_patient
    logger.info(f"Patient created: {new_patient.id}")
    return new_patient
