# report.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/report/user")
async def user_report():
    return {"report": "user report"}
