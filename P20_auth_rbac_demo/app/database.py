# /app/database.py

from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.logger import get_logger 

logger = get_logger(__name__)

mongo_client: AsyncIOMotorClient = None
mongo_db: None = None 

async def connect_to_mongo():

    global mongo_client, mongo_db
    try:
        mongo_client = AsyncIOMotorClient(
            settings.MONGO_DB_URL,
            serverSelectionTimeoutMS=5000 
        )

        await mongo_client.admin.command('ping')
        mongo_db = mongo_client[settings.MONGO_DB_NAME]
        logger.info("Successfully connected to MongoDB!")

        users_collection = mongo_db["users"]
        try:
            await users_collection.create_index("username", unique=True)
            logger.info("Ensured unique index on 'username' in 'users' collection.")
        except Exception as e:
            logger.warning(f"Could not create unique index on 'username' in 'users' collection: {e}. It might already exist.", exc_info=False) # exc_info=False as this is often expected

        await _initialize_collections()

    except Exception as e:
        logger.critical(f"Failed to connect or initialize MongoDB at {settings.MONGO_DB_URL}: {e}", exc_info=True)
        raise # Re-raise to prevent app from starting if DB connection fails

async def close_mongo_connection():

    global mongo_client
    if mongo_client:
        mongo_client.close()
        logger.info("MongoDB connection closed.")
    else:
        logger.warning("Attempted to close MongoDB connection but client was not initialized.")

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
        try:
            collection = mongo_db[col_name]
            count = await collection.count_documents({})
            if count == 0:
                await collection.insert_many(sample_data)
                logger.info(f"Initialized '{col_name}' collection with sample data ({len(sample_data)} documents).")
            else:
                logger.info(f"Collection '{col_name}' already contains {count} documents. Skipping initialization.")
        except Exception as e:
            logger.error(f"Error initializing collection '{col_name}': {e}", exc_info=True)

# Dependency to inject the database object into routes
async def get_database():

    if mongo_db is None:
        logger.critical("MongoDB database client is not initialized. Ensure connect_to_mongo() runs on application startup.")
        raise ConnectionError("MongoDB not connected. Application startup failed or database connection lost.")
    return mongo_db