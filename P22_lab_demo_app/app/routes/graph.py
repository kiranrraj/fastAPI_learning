from fastapi import APIRouter
from app.gpc_service import get_all_vertices, count_vertices_by_label


router = APIRouter(prefix="/graph", tags=["Graph"])

@router.get("/vertices")
async def fetch_vertices():
    return await get_all_vertices()

@router.get("/vertex_counts")
async def fetch_vertices_by_count():
    return await count_vertices_by_label()