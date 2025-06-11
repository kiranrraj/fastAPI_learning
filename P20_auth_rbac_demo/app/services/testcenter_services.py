# app/services/testcenter_service.py
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient

from app.services.base_services import BaseService
from app.config import settings
from app.models.data import TestcenterDataItem
from app.models.base import PyObjectId
from app.utils.logger import get_logger 

logger = get_logger(__name__)

class TestcenterService(BaseService):
    def __init__(self, db: AsyncIOMotorClient):
        # Call the base class constructor with the specific collection name
        super().__init__(collection_name=settings.TESTCENTER_COLLECTION, db=db)
        logger.info(f"TestcenterService initialized for collection: {self.collection_name}")

    async def get_all(self) -> List[Dict[str, Any]]:
        """Retrieves all test center data, converting to TestcenterDataItem model."""
        data = []
        try:
            async for doc in self.collection.find():
                # Ensure _id is handled correctly by Pydantic for output
                data.append(TestcenterDataItem(**doc).model_dump(by_alias=True))
            logger.debug(f"Retrieved {len(data)} test center data items.")
            return data
        except Exception as e:
            logger.error(f"Error retrieving all test center data: {e}", exc_info=True)
            raise # Re-raise for router to handle HTTPException

    async def get_by_id(self, item_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single test center data item by its 'id' field (not _id)."""
        # Assuming 'id' is a direct field for these sample data models, not MongoDB's _id
        try:
            doc = await self.collection.find_one({"id": int(item_id)})
            if doc:
                logger.debug(f"Retrieved test center data item with id: {item_id}.")
                return TestcenterDataItem(**doc).model_dump(by_alias=True)
            logger.debug(f"Test center data item with id: {item_id} not found.")
            return None
        except ValueError: # If item_id is not convertible to int
            logger.warning(f"Invalid item_id format for TestcenterService: {item_id}")
            return None # Or raise a specific error that the router translates to 400
        except Exception as e:
            logger.error(f"Error retrieving test center data by id {item_id}: {e}", exc_info=True)
            raise

    async def create(self, item_data: Dict[str, Any]) -> Dict[str, Any]:
        """Creates a new test center data item."""
        validated_item = TestcenterDataItem(**item_data)
        insert_data = validated_item.model_dump(by_alias=True, exclude_none=True)
        try:
            result = await self.collection.insert_one(insert_data)
            created_doc = await self.collection.find_one({"_id": result.inserted_id})
            if created_doc:
                logger.info(f"Test center data created with _id: {result.inserted_id}")
                return TestcenterDataItem(**created_doc).model_dump(by_alias=True)
            raise RuntimeError(f"Failed to retrieve created test center data after insertion for id: {result.inserted_id}")
        except Exception as e:
            logger.error(f"Error creating test center data: {e}", exc_info=True)
            raise

    async def update(self, item_id: str, item_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Updates an existing test center data item by its 'id' field."""
        validated_item = TestcenterDataItem(**item_data)
        update_set = validated_item.model_dump(by_alias=True, exclude_unset=True, exclude_none=True)
        try:
            # We are updating based on the 'id' field of the document, not MongoDB's _id
            result = await self.collection.update_one(
                {"id": int(item_id)},
                {"$set": update_set}
            )
            if result.matched_count == 0:
                logger.debug(f"Test center data item with id: {item_id} not found for update.")
                return None
            
            updated_doc = await self.collection.find_one({"id": int(item_id)})
            if updated_doc:
                logger.info(f"Test center data item with id: {item_id} updated.")
                return TestcenterDataItem(**updated_doc).model_dump(by_alias=True)
            raise RuntimeError(f"Failed to retrieve updated test center data for id: {item_id}")
        except ValueError:
            logger.warning(f"Invalid item_id format for TestcenterService update: {item_id}")
            return None
        except Exception as e:
            logger.error(f"Error updating test center data with id {item_id}: {e}", exc_info=True)
            raise

    async def delete(self, item_id: str) -> bool:
        """Deletes an test center data item by its 'id' field."""
        try:
            result = await self.collection.delete_one({"id": int(item_id)})
            if result.deleted_count > 0:
                logger.info(f"Test center data item with id: {item_id} deleted.")
                return True
            logger.debug(f"Test center data item with id: {item_id} not found for deletion.")
            return False
        except ValueError:
            logger.warning(f"Invalid item_id format for TestcenterService delete: {item_id}")
            return False
        except Exception as e:
            logger.error(f"Error deleting test center data with id {item_id}: {e}", exc_info=True)
            raise