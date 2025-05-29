# app/api/v1/endpoints/results.py
from fastapi import APIRouter, HTTPException
from uuid import UUID, uuid4
import logging
from app.models.investigation_results import InvestigationResult, InvestigationResultCreate

router = APIRouter()
logger = logging.getLogger("lab_app")

# In-memory DB
results_db: dict[UUID, InvestigationResult] = {}

@router.post(
    "/results",
    response_model=InvestigationResult,
    tags=["Results"]
)
def create_result(result_data: InvestigationResultCreate):
    new_result = InvestigationResult(**result_data.model_dump(), id=uuid4())

    if new_result.id in results_db:
        raise HTTPException(
            status_code=400,
            detail="Result with this ID already exists"
        )

    results_db[new_result.id] = new_result
    logger.info(f"InvestigationResult created: {new_result.id}")
    return new_result
