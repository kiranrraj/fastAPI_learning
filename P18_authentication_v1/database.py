## database.py

## Imports
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

## Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

## Global Variables
mongo_client: AsyncIOMotorClient = None
mongo_db = None

async def connect_to_mongo(mongo_uri: str, db_name: str):
    """Establishes an asynchronous connection to MongoDB."""
    global mongo_client, mongo_db

    try:
        mongo_client = AsyncIOMotorClient(mongo_uri, ServerSelectionTimeoutError=5000)
        mongo_client = mongo_client[db_name]
        await mongo_client.admin.command('ping')
        logging.info(f"Successfully connected to MongoDB at {mongo_uri}, database: {db_name}")

    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logging.error(f"MongoDB connection error {e}")
        raise # Re raising to avoid app startup if connection fails
    except Exception as e:
        logging.error(f"Unexpected error occurred during mongoDB connection")
        raise

async def close_mongo_connection():
    """Closes the MongoDB connection."""
    global mongo_client
    if mongo_client:
        mongo_client.close()
        logging.info("MongoDB connection closed.")