from fastapi import APIRouter, HTTPException
from app.logger import logger
from app.gpc_service import get_all_vertices, count_vertices_by_label, get_vertex_schema_by_label

router = APIRouter(prefix="/graph", tags=["Graph"])

@router.get("/vertices")
async def fetch_vertices():
    try:
        return await get_all_vertices()
    except Exception as e:
        logger.exception("Failed to fetch all vertices")
        raise HTTPException(status_code=500, detail="Error retrieving vertices from the graph")

@router.get("/vertex_counts")
async def fetch_vertices_by_count():
    try:
        return await count_vertices_by_label()
    except Exception as e:
        logger.exception("Failed to fetch vertex counts")
        raise HTTPException(status_code=500, detail="Error retrieving vertex count by label")

@router.get("/schema")
async def fetch_vertex_schemas():
    try:
        return await get_vertex_schema_by_label()
    except Exception as e:
        logger.exception("Failed to fetch vertex schema")
        raise HTTPException(status_code=500, detail="Error retrieving vertex schema")
