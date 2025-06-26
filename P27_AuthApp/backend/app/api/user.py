from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from app.models.user import UserModel, UserCreate, UserUpdate  # Pydantic models for user data validation
from app.db.connection import get_database  # Function to get MongoDB connection
from pymongo.collection import Collection
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["users"])

# Dependency to retrieve the MongoDB users collection from the database
def get_user_collection() -> Collection:
    db = get_database()
    return db["users"]

@router.get("/health", tags=["health"])
async def health_check():
    """
    Health check endpoint.
    Returns:
        JSON object with status 'ok' if server is reachable.
    """
    return {"status": "ok"}

@router.get("/spec", tags=["spec"])
async def get_server_spec():
    """
    Returns server or environment information.
    This can be extended to provide build info, environment variables, etc.
    """
    # Example static info — replace with dynamic details as needed
    return {
        "server": "FastAPI",
        "version": "1.0",
        "description": "User management API",
        "environment": "development"
    }

@router.get("/", response_model=List[UserModel])
async def list_users(users_col: Collection = Depends(get_user_collection)):
    """
    Retrieve a list of all users from MongoDB.
    Returns:
        List of users with ObjectId converted to string for Pydantic compatibility.
    """
    users = list(users_col.find({}))
    for u in users:
        u["id"] = str(u["_id"])
        del u["_id"]
    return users

@router.get("/{user_id}", response_model=UserModel)
async def get_user(user_id: str, users_col: Collection = Depends(get_user_collection)):
    """
    Retrieve a single user by their MongoDB ObjectId.
    Args:
        user_id (str): The MongoDB ObjectId as a hex string.
    Raises:
        HTTP 404 if the user is not found.
    Returns:
        User data with id field as string.
    """
    user = users_col.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user["id"] = str(user["_id"])
    del user["_id"]
    return user

@router.post("/", response_model=UserModel, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, users_col: Collection = Depends(get_user_collection)):
    """
    Create a new user document in MongoDB.
    Args:
        user (UserCreate): User data validated by Pydantic.
    Returns:
        The created user document including the generated MongoDB _id as string id.
    """
    user_dict = user.dict()
    result = users_col.insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)
    return user_dict

@router.put("/{user_id}", response_model=UserModel)
async def update_user(user_id: str, user: UserUpdate, users_col: Collection = Depends(get_user_collection)):
    """
    Update existing user data partially.
    Args:
        user_id (str): MongoDB ObjectId of the user to update.
        user (UserUpdate): Partial user data to update.
    Raises:
        HTTP 404 if the user does not exist.
    Returns:
        Updated user document.
    """
    update_result = users_col.update_one({"_id": ObjectId(user_id)}, {"$set": user.dict(exclude_unset=True)})
    if update_result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    updated_user = users_col.find_one({"_id": ObjectId(user_id)})
    updated_user["id"] = str(updated_user["_id"])
    del updated_user["_id"]
    return updated_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str, users_col: Collection = Depends(get_user_collection)):
    """
    Delete a user by MongoDB ObjectId.
    Args:
        user_id (str): The ObjectId hex string of the user.
    Raises:
        HTTP 404 if the user does not exist.
    Returns:
        None with HTTP 204 status on successful deletion.
    """
    delete_result = users_col.delete_one({"_id": ObjectId(user_id)})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return None
