# app/routes/entity.py

from fastapi import APIRouter, Query, HTTPException
from app.logger import logger
from app.gpc_service import get_entity_spec_from_graph

router = APIRouter(prefix="/labx/entity", tags=["LabXEntitySpec"])

@router.get("/spec")
async def get_entity_spec(entity: str = Query(...), mode: str = Query("CRUD")):
    try:
        spec = await get_entity_spec_from_graph(entity)
        if not spec:
            raise HTTPException(status_code=404, detail=f"Entity '{entity}' not found in graph")
        return spec
    except Exception as e:
        logger.exception(f"Error fetching spec for entity '{entity}'")
        raise HTTPException(status_code=500, detail="Unable to retrieve entity spec")
