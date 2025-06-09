# entity.py

from fastapi import APIRouter

router = APIRouter()

@router.post("/entity/{entity_name}/upsert")
async def upsert_entity(entity_name: str):
    return {"message": f"Upsert entity {entity_name}"}
