# edge.py

from fastapi import APIRouter

router = APIRouter()

@router.post("/edge/{edge_name}/upsert")
async def upsert_edge(edge_name: str):
    return {"message": f"Upsert edge {edge_name}"}
