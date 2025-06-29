# src/db/crud/user.py

from typing import Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from bson import ObjectId
from src.models.user_model import UserInDB
from src.db.mongo import mongo
from bson import ObjectId


async def get_user_by_email(email: str) -> Optional[UserInDB]:
    """
    Fetch a user document from the MongoDB `users` collection by email.
    Returns a UserInDB object if found, else None.
    """
    collection: AsyncIOMotorCollection = mongo.db_instance["users"]
    user_data = await collection.find_one({"email": email})
    if user_data:
        return UserInDB(**user_data)
    return None


async def get_user_by_id(user_id: str) -> UserInDB | None:
    collection = mongo.db_instance["users"]
    
    query = {"_id": user_id}
    
    user = await collection.find_one(query)
    if not user and ObjectId.is_valid(user_id):
        user = await collection.find_one({"_id": ObjectId(user_id)})
    
    return UserInDB(**user) if user else None

