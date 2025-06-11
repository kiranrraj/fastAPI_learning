# app/services/admin_service.py
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient

from app.services.base_services import BaseService
from app.config import settings
from app.models.data import AdminDataItem # Import specific Pydantic model
from app.models.base import PyObjectId # For converting string IDs to ObjectId
from app.utils.logger import get_logger

logger = get_logger(__name__)

class AdminService(BaseService):
    def __init__(self, db: AsyncIOMotorClient):
        # Call the base class constructor with the specific collection name
        super().__init__(collection_name=settings.ADMIN_COLLECTION, db=db)
        logger.info(f"AdminService initialized for collection: {self.collection_name}")

    async def get_all(self) -> List[Dict[str, Any]]:
        """Retrieves all admin data, converting to AdminDataItem model."""
        data = []
        try:
            async for doc in self.collection.find():
                # Ensure _id is handled correctly by Pydantic for output
                data.append(AdminDataItem(**doc).model_dump(by_alias=True))
            logger.debug(f"Retrieved {len(data)} admin data items.")
            return data
        except Exception as e:
            logger.error(f"Error retrieving all admin data: {e}", exc_info=True)
            raise # Re-raise for router to handle HTTPException

    async def get_by_id(self, item_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single admin data item by its 'id' field (not _id)."""
        # Assuming 'id' is a direct field for these sample data models, not MongoDB's _id
        try:
            doc = await self.collection.find_one({"id": int(item_id)}) # Convert to int if your ID is int
            if doc:
                logger.debug(f"Retrieved admin data item with id: {item_id}.")
                return AdminDataItem(**doc).model_dump(by_alias=True)
            logger.debug(f"Admin data item with id: {item_id} not found.")
            return None
        except ValueError: # If item_id is not convertible to int
            logger.warning(f"Invalid item_id format for AdminService: {item_id}")
            return None # Or raise a specific error that the router translates to 400
        except Exception as e:
            logger.error(f"Error retrieving admin data by id {item_id}: {e}", exc_info=True)
            raise

    async def create(self, item_data: Dict[str, Any]) -> Dict[str, Any]:
        """Creates a new admin data item."""
        # Use AdminDataItem to validate incoming data before insertion
        validated_item = AdminDataItem(**item_data)
        insert_data = validated_item.model_dump(by_alias=True, exclude_none=True)
        try:
            result = await self.collection.insert_one(insert_data)
            created_doc = await self.collection.find_one({"_id": result.inserted_id})
            if created_doc:
                logger.info(f"Admin data created with _id: {result.inserted_id}")
                return AdminDataItem(**created_doc).model_dump(by_alias=True)
            raise RuntimeError(f"Failed to retrieve created admin data after insertion for id: {result.inserted_id}")
        except Exception as e:
            logger.error(f"Error creating admin data: {e}", exc_info=True)
            raise

    async def update(self, item_id: str, item_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Updates an existing admin data item by its 'id' field."""
        # Use AdminDataItem to validate incoming data before update
        validated_item = AdminDataItem(**item_data)
        update_set = validated_item.model_dump(by_alias=True, exclude_unset=True, exclude_none=True)
        try:
            # We are updating based on the 'id' field of the document, not MongoDB's _id
            result = await self.collection.update_one(
                {"id": int(item_id)},
                {"$set": update_set}
            )
            if result.matched_count == 0:
                logger.debug(f"Admin data item with id: {item_id} not found for update.")
                return None
            
            updated_doc = await self.collection.find_one({"id": int(item_id)})
            if updated_doc:
                logger.info(f"Admin data item with id: {item_id} updated.")
                return AdminDataItem(**updated_doc).model_dump(by_alias=True)
            raise RuntimeError(f"Failed to retrieve updated admin data for id: {item_id}")
        except ValueError:
            logger.warning(f"Invalid item_id format for AdminService update: {item_id}")
            return None
        except Exception as e:
            logger.error(f"Error updating admin data with id {item_id}: {e}", exc_info=True)
            raise

    async def delete(self, item_id: str) -> bool:
        """Deletes an admin data item by its 'id' field."""
        try:
            result = await self.collection.delete_one({"id": int(item_id)})
            if result.deleted_count > 0:
                logger.info(f"Admin data item with id: {item_id} deleted.")
                return True
            logger.debug(f"Admin data item with id: {item_id} not found for deletion.")
            return False
        except ValueError:
            logger.warning(f"Invalid item_id format for AdminService delete: {item_id}")
            return False
        except Exception as e:
            logger.error(f"Error deleting admin data with id {item_id}: {e}", exc_info=True)
            raise