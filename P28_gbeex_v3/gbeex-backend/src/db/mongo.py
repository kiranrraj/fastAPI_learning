from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError
from src.core.config import config
from src.core.logger import logger

class MongoDB:
    client: AsyncIOMotorClient | None = None
    db_instance: AsyncIOMotorDatabase | None = None # This will hold the active DB object

mongo = MongoDB() # This is the single instance of MongoDB management

async def connect_to_mongo():
    try:
        logger.info("Connecting to MongoDB...")
        mongo.client = AsyncIOMotorClient(config.MONGO_URI, serverSelectionTimeoutMS=5000)

        # Explicitly ping the admin database to confirm server reachability
        await mongo.client.admin.command("ping")
        logger.info(" MongoDB server is reachable.")

        # Get the specific database instance
        mongo.db_instance = mongo.client[config.MONGO_DB_NAME]

        await mongo.db_instance.list_collection_names(filter={"name": "users"})
        logger.info(f" Found 'users' collection in '{config.MONGO_DB_NAME}' database, confirming database readiness.")

        logger.info(f" Connected to MongoDB: {config.MONGO_DB_NAME}")
        # Debugging: Confirm that db_instance is indeed set here
        logger.debug(f"MongoDB db_instance set: {mongo.db_instance is not None}, id: {id(mongo.db_instance)}")

    except ServerSelectionTimeoutError as e:
        logger.critical(" MongoDB connection timed out during server selection. "
                        "Is the MongoDB server running and accessible at "
                        f"'{config.MONGO_URI}'?", exc_info=True)
        # Raise a RuntimeError to propagate the failure to lifespan context
        raise RuntimeError("MongoDB server timeout: Cannot establish connection.")
    except PyMongoError as e:
        logger.critical(" MongoDB connection failed during database operations. "
                        "Check credentials, database name, or network issues.", exc_info=True)
        raise RuntimeError("Failed to connect to MongoDB: Database operation error.")
    except Exception as e:
        logger.critical(f" An unexpected error occurred during MongoDB connection: {e}", exc_info=True)
        raise RuntimeError(f"Unexpected MongoDB connection error: {e}")

async def close_mongo_connection():
    if mongo.client:
        logger.info("Closing MongoDB connection...")
        mongo.client.close()
        mongo.db_instance = None # Explicitly clear the instance's attribute on close
        logger.info(" MongoDB connection closed")