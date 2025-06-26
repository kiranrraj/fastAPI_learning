from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from app.models.user import UserModel, UserCreate, UserUpdate
from app.db.connection import get_database
from motor.motor_asyncio import AsyncIOMotorCollection
from bson import ObjectId
from app.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

# Dependency to get async user collection
async def get_user_collection() -> AsyncIOMotorCollection:
    db = get_database()
    return db["users"]

@router.get("/health", tags=["health"])
async def health_check():
    """Simple health check endpoint."""
    return {"status": "ok"}

@router.get("/spec", tags=["spec"])
async def get_server_spec():
    """Return server info."""
    return {
        "server": "FastAPI",
        "version": "1.0",
        "description": "User management API",
        "environment": "development"
    }

@router.get("/", response_model=List[UserModel])
async def list_users(
    users_col: AsyncIOMotorCollection = Depends(get_user_collection),
    current_user: dict = Depends(get_current_user)):
    """Fetch all users."""

    users = await users_col.find({}).to_list(length=100)  # fetch max 100 users
    for u in users:
        u["id"] = str(u["_id"])
        del u["_id"]
    return users

@router.get("/{user_id}", response_model=UserModel)
async def get_user(user_id: str, users_col: AsyncIOMotorCollection = Depends(get_user_collection)):
    """Fetch user by ID."""

    query_id = resolve_id(user_id)
    user = await users_col.find_one({"_id": query_id})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user["id"] = str(user["_id"])
    del user["_id"]
    return user

@router.post("/", response_model=UserModel, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, users_col: AsyncIOMotorCollection = Depends(get_user_collection)):
    """Create new user."""
    user_dict = user.dict()
    result = await users_col.insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)
    return user_dict

@router.put("/{user_id}", response_model=UserModel)
async def update_user(user_id: str, user: UserUpdate, users_col: AsyncIOMotorCollection = Depends(get_user_collection)):
    """Update existing user."""
    update_result = await users_col.update_one({"_id": user_id}, {"$set": user.dict(exclude_unset=True)})
    if update_result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    updated_user = await users_col.find_one({"_id": user_id})
    updated_user["id"] = str(updated_user["_id"])
    del updated_user["_id"]
    return updated_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str, users_col: AsyncIOMotorCollection = Depends(get_user_collection)):
    """Delete user by ID."""
    delete_result = await users_col.delete_one({"_id": user_id})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return None
