# app/services/doctor_service.py
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient

from app.services.base_services import BaseService
from app.config import settings
from app.models.data import DoctorDataItem
from app.models.base import PyObjectId
from app.utils.logger import get_logger

logger = get_logger(__name__)

class DoctorService(BaseService):
    def __init__(self, db: AsyncIOMotorClient):
        super().__init__(collection_name=settings.DOCTOR_COLLECTION, db=db)
        logger.info(f"DoctorService initialized for collection: {self.collection_name}")

    async def get_all(self) -> List[Dict[str, Any]]:
        data = []
        try:
            async for doc in self.collection.find():
                data.append(DoctorDataItem(**doc).model_dump(by_alias=True))
            logger.debug(f"Retrieved {len(data)} doctor data items.")
            return data
        except Exception as e:
            logger.error(f"Error retrieving all doctor data: {e}", exc_info=True)
            raise

    async def get_by_id(self, item_id: str) -> Optional[Dict[str, Any]]:
        try:
            doc = await self.collection.find_one({"id": int(item_id)})
            if doc:
                logger.debug(f"Retrieved doctor data item with id: {item_id}.")
                return DoctorDataItem(**doc).model_dump(by_alias=True)
            logger.debug(f"Doctor data item with id: {item_id} not found.")
            return None
        except ValueError:
            logger.warning(f"Invalid item_id format for DoctorService: {item_id}")
            return None
        except Exception as e:
            logger.error(f"Error retrieving doctor data by id {item_id}: {e}", exc_info=True)
            raise

    async def create(self, item_data: Dict[str, Any]) -> Dict[str, Any]:
        validated_item = DoctorDataItem(**item_data)
        insert_data = validated_item.model_dump(by_alias=True, exclude_none=True)
        try:
            result = await self.collection.insert_one(insert_data)
            created_doc = await self.collection.find_one({"_id": result.inserted_id})
            if created_doc:
                logger.info(f"Doctor data created with _id: {result.inserted_id}")
                return DoctorDataItem(**created_doc).model_dump(by_alias=True)
            raise RuntimeError(f"Failed to retrieve created doctor data after insertion for id: {result.inserted_id}")
        except Exception as e:
            logger.error(f"Error creating doctor data: {e}", exc_info=True)
            raise

    async def update(self, item_id: str, item_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        validated_item = DoctorDataItem(**item_data)
        update_set = validated_item.model_dump(by_alias=True, exclude_unset=True, exclude_none=True)
        try:
            result = await self.collection.update_one(
                {"id": int(item_id)},
                {"$set": update_set}
            )
            if result.matched_count == 0:
                logger.debug(f"Doctor data item with id: {item_id} not found for update.")
                return None
            
            updated_doc = await self.collection.find_one({"id": int(item_id)})
            if updated_doc:
                logger.info(f"Doctor data item with id: {item_id} updated.")
                return DoctorDataItem(**updated_doc).model_dump(by_alias=True)
            raise RuntimeError(f"Failed to retrieve updated doctor data for id: {item_id}")
        except ValueError:
            logger.warning(f"Invalid item_id format for DoctorService update: {item_id}")
            return None
        except Exception as e:
            logger.error(f"Error updating doctor data with id {item_id}: {e}", exc_info=True)
            raise

    async def delete(self, item_id: str) -> bool:
        try:
            result = await self.collection.delete_one({"id": int(item_id)})
            if result.deleted_count > 0:
                logger.info(f"Doctor data item with id: {item_id} deleted.")
                return True
            logger.debug(f"Doctor data item with id: {item_id} not found for deletion.")
            return False
        except ValueError:
            logger.warning(f"Invalid item_id format for DoctorService delete: {item_id}")
            return False
        except Exception as e:
            logger.error(f"Error deleting doctor data with id {item_id}: {e}", exc_info=True)
            raise