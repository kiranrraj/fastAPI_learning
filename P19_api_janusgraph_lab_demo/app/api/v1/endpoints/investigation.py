# app/api/v1/endpoints/investigations.py
from fastapi import APIRouter, HTTPException
from uuid import UUID, uuid4
import logging
from app.models.investigation import Investigation, InvestigationCreate
from app.db.memory import investigations_db  

router = APIRouter()
logger = logging.getLogger("lab_app")

@router.post(
    "/investigation",
    response_model=Investigation,
    tags=["Investigation"]
)
def create_investigation(investigation_data: InvestigationCreate):
    new_investigation = Investigation(**investigation_data.model_dump(), id=uuid4())
    
    if new_investigation.id in investigations_db:
        raise HTTPException(
            status_code=400,
            detail="Investigation with this ID already exists"
        )
    investigations_db[new_investigation.id] = new_investigation
    logger.info(f"Investigation created: {new_investigation.id}")
    return new_investigation
