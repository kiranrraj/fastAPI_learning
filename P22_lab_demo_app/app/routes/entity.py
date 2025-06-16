# app/routes/entity.py

from fastapi import APIRouter, Query, HTTPException, Body
from app.logger import logger
from app.gpc_service import get_entity_spec_from_graph, post_vertex_in_graph

router = APIRouter(prefix="/labx/entity", tags=["LabXEntitySpec"])

@router.post("/create")
async def create_entity(
    entity: str = Query(..., description="Entity label to create"),
    payload: dict = Body(...)
):
    logger.info(f"Creating new {entity}")
    try:
        vertex_id = await post_vertex_in_graph(entity, payload)
        return {
            "Message": f"{entity.upper()} created, id: {vertex_id}"
        }
    except Exception as e:
        logger.exception(f"labX: Failed to create {entity}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Could not create {entity}."
        )

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
