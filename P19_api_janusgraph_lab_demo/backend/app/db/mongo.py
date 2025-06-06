# backend/app/db/mongo.py

from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from app.core.config import get_settings
from loguru import logger
import time

settings = get_settings()
mongo_client: MongoClient | None = None 

def init_mongo(retries: int = 3, delay: float = 2.0):
    global mongo_client
    attempt = 0
    while attempt < retries:
        try:
            mongo_client = MongoClient(
                settings.mongo_uri,
                serverSelectionTimeoutMS=3000
            )
            mongo_client.admin.command("ping")
            logger.info("[MongoDB] Connected successfully.")
            return
        except ServerSelectionTimeoutError as e:
            logger.warning(f"[MongoDB] Retry {attempt+1} failed: {e}")
            time.sleep(delay)
            attempt += 1
    logger.error("[MongoDB] Could not connect after retries.")
    mongo_client = None

def get_mongo_db():
    if not mongo_client:
        raise RuntimeError("MongoDB client not initialized")
    return mongo_client[settings.mongo_db]

def close_mongo():
    global mongo_client
    if mongo_client:
        mongo_client.close()
        logger.info("[MongoDB] Connection closed.")
        mongo_client = None

def mongo_status() -> dict:
    try:
        mongo_client.admin.command("ping")
        return {"status": "ok", "db": settings.mongo_db}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
