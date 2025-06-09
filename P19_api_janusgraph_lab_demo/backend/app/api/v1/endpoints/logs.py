# logs.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/logs")
async def fetch_logs():
    return {"logs": "recent logs"}
