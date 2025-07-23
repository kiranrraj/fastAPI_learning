# routers/notifications.py
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from database import get_database
from auth import get_current_user
from models.auth import UserInDB
from models.notifications import Notification
from config import NOTIFICATION_COL

router = APIRouter(tags=["Notifications"])
logger = logging.getLogger(__name__)

@router.get("/api/v1/notifications", response_model=List[Notification])
async def list_notifications(current_user: UserInDB = Depends(get_current_user), db=Depends(get_database)):
    cursor = db[NOTIFICATION_COL].find({"userId": current_user.staffId}, {"_id":0})
    return await cursor.to_list(length=None)

@router.post("/api/v1/notifications/{nid}/read")
async def mark_notification_read(nid: str, current_user: UserInDB = Depends(get_current_user), db=Depends(get_database)):
    res = await db[NOTIFICATION_COL].update_one(
        {"id": nid, "userId": current_user.staffId},
        {"$set": {"read": True}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "ok"}