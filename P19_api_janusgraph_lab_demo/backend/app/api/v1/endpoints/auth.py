# auth.py

from fastapi import APIRouter

router = APIRouter()

@router.post("/auth/token")
async def login():
    return {"token": "fake-token"}
