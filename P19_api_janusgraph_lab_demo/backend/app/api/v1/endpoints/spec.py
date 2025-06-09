# spec.py

from fastapi import APIRouter

router = APIRouter()

@router.post("/spec/entity/add")
async def add_entity_spec():
    return {"message": "Add entity spec"}
