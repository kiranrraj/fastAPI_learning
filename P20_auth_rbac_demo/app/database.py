# /app/database.py

from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
import logging

logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("appLogger")

client: AsyncIOMotorClient = None
database: str = None

async def connect_to_mongo():
    global client, database
    try:
        client = AsyncIOMotorClient(settings.MONGO_DB_URL)
        database = client[settings.MONGO_DB_NAME]
        users_collection = database["users"]

        try:
            await users_collection.create_index("username", unique=True)
            logger.info("Ensured unique index on 'username' in 'users' collection.")
        except Exception as e:
            logger.warning(f"Could not create unique index on 'username': {e}. It might already exist.")


            # create sample data collections and add some initial data if they don't exist
            await _initialize_collections()
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise # Re-raise to prevent app from starting if DB connection fails

async def _initialize_collections():
    collections_to_init = {
        settings.ADMIN_COLLECTION: [
            {"id": 1, "name": "Admin Report 1", "description": "Critical system overview"},
            {"id": 2, "name": "Admin Report 2", "description": "User management data"}
        ],
        settings.DOCTOR_COLLECTION: [
            {"id": 101, "patient_name": "Alice Smith", "diagnosis": "Flu", "medication": "Tamiflu"},
            {"id": 102, "patient_name": "Bob Johnson", "diagnosis": "Common Cold", "medication": "Rest and fluids"}
        ],
        settings.TESTCENTER_COLLECTION: [
            {"id": 201, "test_type": "Blood Panel", "results": "Normal", "date": "2024-06-10"},
            {"id": 202, "test_type": "COVID-19", "results": "Negative", "date": "2024-06-11"}
        ]
    }

    for col_name, sample_data in collections_to_init.items():
        collection = database[col_name]
        count = await collection.count_documents({})
        if count == 0:
            await collection.insert_many(sample_data)
            logger.info(f"Initialized '{col_name}' collection with sample data.")
        else:
            logger.info(f"Collection '{col_name}' already contains data. Skipping initialization.")

# Dependency to inject the database object into routes
# The get_database() dependency ensures that any route 
# or other dependency that needs to interact with MongoDB 
# receives a valid, already connected motor database instance
async def get_database():
    if database is None:
        raise ConnectionError("MongoDB not connected. Ensure connect_to_mongo() runs on startup.")
    return database