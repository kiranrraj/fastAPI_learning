# database.py
from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URI, DATABASE_NAME

# MongoDB client instance
client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]

def get_database():
    # Dependency to get the MongoDB database client
    return db