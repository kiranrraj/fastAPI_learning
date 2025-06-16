from fastapi import APIRouter, HTTPException, Query
from app.logger import logger
from app.gpc_service import get_all_vertices, count_vertices_by_label, get_vertex_schema_by_label

router = APIRouter(prefix="/labx", tags=["Graph"])

# FastAPI router in graph.py that exposes 3 GET endpoints under the /labx prefix
# 1. /labx/vertices
# 2. /labx/vertex_counts
# 3. /labx/schema

@router.get("/vertices")
# Returns all vertices.
async def fetch_vertices(
    skip: int = Query(0, ge=0), 
    limit: int = Query(10, ge=1, le=100)
):
    try:
        return await get_all_vertices (skip, limit)
    except Exception as e:
        logger.exception("Failed to fetch vertices")
        raise HTTPException(status_code=500, detail="Error retrieving vertices from the graph")

@router.get("/vertex_counts")
# Returns a count of each vertex label.
async def fetch_vertices_by_count():
    try:
        return await count_vertices_by_label()
    except Exception as e:
        logger.exception("Failed to fetch vertex counts")
        raise HTTPException(status_code=500, detail="Error retrieving vertex count by label")

@router.get("/schema")
# Returns a list of fields (properties) used by each label.
async def fetch_vertex_schemas():
    try:
        return await get_vertex_schema_by_label()
    except Exception as e:
        logger.exception("Failed to fetch vertex schema")
        raise HTTPException(status_code=500, detail="Error retrieving vertex schema")

