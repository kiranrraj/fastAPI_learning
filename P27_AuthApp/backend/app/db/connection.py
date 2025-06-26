# app/core/db.py

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError
from app.core.config import settings
from app.core.logger import get_logger
import sys

logger = get_logger("mongo")

# Mongo client instance (singleton pattern)
client: AsyncIOMotorClient | None = None

def get_client() -> AsyncIOMotorClient:
    global client

    if client is None:
        try:
            logger.info(" Creating MongoDB client connection")
            client = AsyncIOMotorClient(
                settings.MONGO_SERVER,
                serverSelectionTimeoutMS=5000
            )
            client.admin.command("ping")  # Ping to ensure connection
            logger.info(" MongoDB client connected successfully")

        except ServerSelectionTimeoutError as e:
            logger.critical(f" MongoDB connection failed: {e}")
            sys.exit(1)
        except Exception as e:
            logger.critical(f" Unexpected DB error: {e}")
            sys.exit(1)

    return client

def get_database():
    try:
        db = get_client()[settings.MONGO_DATABASE]
        logger.debug(f" Accessing database: {settings.MONGO_DATABASE}")
        return db
    except Exception as e:
        logger.error(f" Failed to access database: {e}")
        raise

def close_client():
    global client
    if client:
        logger.info(" Closing MongoDB client connection")
        client.close()
        client = None
