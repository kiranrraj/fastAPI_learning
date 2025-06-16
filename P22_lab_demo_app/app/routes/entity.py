# app/routes/entity.py

from fastapi import APIRouter, Query, HTTPException
from app.logger import logger

router = APIRouter(prefix="/labx/entity", tags=["LabXEntitySpec"])

@router.get("/spec")
async def get_entity_spec(entity: str = Query(...), mode: str = Query("CRUD")):
    """
    Fetches the specification of a LabX entity including its attributes.
    """
    try:
        # For testing, response
        return {
            "entity": entity,
            "mode": mode,
            "spec": "This is where we will return the full entity specification."
        }
    except Exception as e:
        logger.exception("Error while fetching entity spec.")
        raise HTTPException(status_code=500, detail="Internal Server Error")
