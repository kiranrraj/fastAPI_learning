# admin.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/admin/dashboard/stats")
async def dashboard_stats():
    return {"stats": "admin summary"}
