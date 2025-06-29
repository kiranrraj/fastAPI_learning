from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from src.db.mongo import mongo
from src.models.notification_model import NotificationCreate, NotificationInDB
from bson import ObjectId
from datetime import datetime


async def create_notification(data: NotificationCreate) -> str:
    """
    Create a new notification for a user.
    """
    collection: AsyncIOMotorCollection = mongo.db_instance["notifications"]
    doc = data.dict()
    doc["timestamp"] = datetime.utcnow()
    doc["read"] = False  # default unread
    result = await collection.insert_one(doc)
    return str(result.inserted_id)


async def get_notifications_by_user(user_id: str, limit: int = 20) -> List[NotificationInDB]:
    """
    Fetch recent notifications for a specific user.
    """
    collection: AsyncIOMotorCollection = mongo.db_instance["notifications"]
    cursor = collection.find({"user_id": user_id}).sort("timestamp", -1).limit(limit)
    return [NotificationInDB(**doc) async for doc in cursor]


async def mark_notification_read(notification_id: str):
    """
    Mark a single notification as read.
    """
    collection: AsyncIOMotorCollection = mongo.db_instance["notifications"]
    await collection.update_one(
        {"_id": ObjectId(notification_id)},
        {"$set": {"read": True}}
    )


async def count_unread_notifications(user_id: str) -> int:
    """
    Count the number of unread notifications for a given user.
    """
    collection: AsyncIOMotorCollection = mongo.db_instance["notifications"]
    return await collection.count_documents({"user_id": user_id, "read": False})


async def delete_notification(notification_id: str) -> bool:
    """
    Permanently delete a notification (e.g., via 'close' action in UI).
    Returns True if a document was deleted.
    """
    collection: AsyncIOMotorCollection = mongo.db_instance["notifications"]
    result = await collection.delete_one({"_id": ObjectId(notification_id)})
    return result.deleted_count == 1
