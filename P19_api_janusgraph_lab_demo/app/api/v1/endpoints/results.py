# app/api/v1/endpoints/results.py
from fastapi import APIRouter, HTTPException
import logging
from uuid import UUID
from typing import Dict
from app.models.investigation_result import InvestigationResult, InvestigationResultCreate
from app.db.memory import results_db

router = APIRouter()
logger = logging.getLogger("lab_app")

@router.post(
    "/result",
    response_model=InvestigationResult,
    tags=["Results"]
)
def create_result(result_data: InvestigationResultCreate):
    new_result = InvestigationResult(**result_data.model_dump())

    if new_result.id in results_db:
        raise HTTPException(status_code=400, detail="Result with this ID already exists")

    results_db[new_result.id] = new_result
    logger.info(f"InvestigationResult created: {new_result.id}")
    return new_result
