# app/services/token_storage.py

from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorCollection
from app.db.connection import get_database
from app.core.logger import get_logger

logger = get_logger("token")

async def get_token_collection() -> AsyncIOMotorCollection:
    db = get_database()
    return db["refresh_tokens"]

async def store_refresh_token(user_id: str, token: str, expires_minutes: int = 60 * 24 * 7):
    collection = await get_token_collection()
    expire_at = datetime.utcnow() + timedelta(minutes=expires_minutes)
    await collection.insert_one({
        "user_id": user_id,
        "token": token,
        "expires_at": expire_at,
        "created_at": datetime.utcnow()
    })
    logger.info(f"Refresh token stored for user: {user_id}")

async def is_token_valid(token: str) -> bool:
    collection = await get_token_collection()
    return await collection.find_one({"token": token}) is not None

async def delete_token(token: str):
    collection = await get_token_collection()
    await collection.delete_one({"token": token})
    logger.info(f"Refresh token deleted: {token}")

async def delete_tokens_by_user(user_id: str):
    collection = await get_token_collection()
    await collection.delete_many({"user_id": user_id})
    logger.info(f"All refresh tokens cleared for user: {user_id}")
