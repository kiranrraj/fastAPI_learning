# app/services/base_service.py
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection
from app.utils.logger import get_logger

logger = get_logger(__name__)

class BaseService(ABC):
    """
    Abstract Base Class for all data services.
    Provides a common interface for CRUD operations and handles
    the MongoDB collection initialization.
    """

    def __init__(self, collection_name: str, db: AsyncIOMotorClient):
        """
        Initializes the BaseService with a MongoDB collection.

        Args:
            collection_name (str): The name of the MongoDB collection to operate on.
            db (AsyncIOMotorClient): The MongoDB database client instance.
        """
        self.collection_name = collection_name
        self.db = db
        # Get the specific collection from the database
        self.collection: AsyncIOMotorCollection = db[collection_name]
        logger.debug(f"BaseService initialized for collection: {self.collection_name}")

    @abstractmethod
    async def get_all(self) -> List[Dict[str, Any]]:
        """
        Abstract method to retrieve all items from the collection.
        Concrete services must implement this.
        """
        pass

    @abstractmethod
    async def get_by_id(self, item_id: str) -> Optional[Dict[str, Any]]:
        """
        Abstract method to retrieve a single item by its ID.
        Concrete services must implement this.
        """
        pass

    @abstractmethod
    async def create(self, item_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Abstract method to create a new item in the collection.
        Concrete services must implement this.
        """
        pass

    @abstractmethod
    async def update(self, item_id: str, item_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Abstract method to update an existing item by its ID.
        Concrete services must implement this.
        """
        pass

    @abstractmethod
    async def delete(self, item_id: str) -> bool:
        """
        Abstract method to delete an item by its ID.
        Concrete services must implement this.
        """
        pass