# src/routes/notification.py

from fastapi import APIRouter, Depends, HTTPException, status
from src.models.notification_model import NotificationCreate, NotificationPublic
from src.db.crud.notification import (
    create_notification,
    get_notifications_by_user,
    mark_notification_read,
    delete_notification,
    count_unread_notifications,
)
from src.core.dependencies import get_current_user
from src.models.user_response import UserPublic
from src.core.logger import logger

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.post("/", status_code=201)
async def post_notification(
    data: NotificationCreate
):
    """
    Create a new notification manually (typically by system or admin).
    """
    try:
        notification_id = await create_notification(data)
        logger.info(f"[NOTIFICATION] Created for user {data.user_id} with ID {notification_id}")
        return {"id": notification_id}
    except Exception as e:
        logger.exception("[NOTIFICATION] Failed to create notification.")
        raise HTTPException(status_code=500, detail="Failed to create notification")

@router.get("/", response_model=list[NotificationPublic])
async def get_my_notifications(
    current_user: UserPublic = Depends(get_current_user)
):
    """
    Get a list of recent notifications for the current user.
    """
    try:
        notifications = await get_notifications_by_user(current_user.id)
        logger.info(f"[NOTIFICATION] Fetched {len(notifications)} for user {current_user.id}")
        return notifications
    except Exception as e:
        logger.exception("[NOTIFICATION] Failed to retrieve notifications.")
        raise HTTPException(status_code=500, detail="Unable to fetch notifications")

@router.get("/unread-count", response_model=int)
async def get_unread_count(
    current_user: UserPublic = Depends(get_current_user)
):
    """
    Returns the count of unread notifications for header display.
    """
    try:
        count = await count_unread_notifications(current_user.id)
        return count
    except Exception as e:
        logger.exception("[NOTIFICATION] Failed to count unread notifications.")
        raise HTTPException(status_code=500, detail="Unable to get unread count")

@router.patch("/{notification_id}/read", status_code=204)
async def mark_as_read(
    notification_id: str,
    current_user: UserPublic = Depends(get_current_user)
):
    """
    Mark a specific notification as read for the current user.
    """
    try:
        await mark_notification_read(notification_id)
        logger.info(f"[NOTIFICATION] Marked as read: {notification_id}")
    except Exception as e:
        logger.exception(f"[NOTIFICATION] Failed to mark as read: {notification_id}")
        raise HTTPException(status_code=500, detail="Unable to mark as read")

@router.delete("/{notification_id}", status_code=204)
async def delete_user_notification(
    notification_id: str,
    current_user: UserPublic = Depends(get_current_user)
):
    """
    Delete a notification permanently (e.g., user closes it).
    """
    try:
        await delete_notification(notification_id, current_user.id)
        logger.info(f"[NOTIFICATION] Deleted: {notification_id}")
    except Exception as e:
        logger.exception(f"[NOTIFICATION] Failed to delete: {notification_id}")
        raise HTTPException(status_code=500, detail="Unable to delete notification")
