from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGO_SERVER)
db = client[settings.MONGO_DATABASE]

def get_database():
    return db
