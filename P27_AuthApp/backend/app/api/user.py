# app/api/user.py

from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from motor.motor_asyncio import AsyncIOMotorCollection
from bson import ObjectId

from app.models.user import UserModel, UserCreate, UserUpdate
from app.db.connection import get_database
from app.dependencies import get_current_user, require_admin
from app.utils.resolve_id import resolve_id

router = APIRouter(prefix="/users", tags=["users"])

# Dependency to get async user collection
# Get users collection
async def get_user_collection() -> AsyncIOMotorCollection:
    db = get_database()
    return db["users"]

# Helper: check if user is admin
async def require_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user

@router.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}

@router.get("/spec", tags=["spec"])
async def get_server_spec():
    """Returns API spec details."""
    return {
        "server": "FastAPI",
        "version": "1.0",
        "description": "User management API",
        "environment": "development"
    }

@router.get("/", response_model=List[UserModel])
async def list_users(
    users_col: AsyncIOMotorCollection = Depends(get_user_collection),
    _: dict = Depends(require_admin)):
    """Admin only: List all users."""
    users = await users_col.find({}).to_list(length=100)
    for u in users:
        u["id"] = str(u["_id"])
        del u["_id"]
    return users

@router.get("/me", response_model=UserModel)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """
    Authenticated users only: Fetch their own profile.
    Example: GET /users/me Authorization: Bearer <access_token>
    """
    user_copy = current_user.copy()
    user_copy["id"] = str(user_copy["_id"])
    del user_copy["_id"]
    return user_copy


@router.get("/{user_id}", response_model=UserModel)
async def get_user(
    user_id: str,
    users_col: AsyncIOMotorCollection = Depends(get_user_collection),
    _: dict = Depends(require_admin)):
    """Admin only: Get user by ID (ObjectId or custom string ID).
    Example: GET /users/1234, GET /users/admin@ABC@000
    """
    query_id = resolve_id(user_id)
    user = await users_col.find_one({"_id": query_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["id"] = str(user["_id"])
    del user["_id"]
    return user

@router.post("/", response_model=UserModel, status_code=status.HTTP_201_CREATED)
async def create_user(
    user: UserCreate,
    users_col: AsyncIOMotorCollection = Depends(get_user_collection),
    _: dict = Depends(require_admin)):
    """Admin only: Create a new user.
    Example payload:
    {
        "username": "kiranraj_r",
        "email": "kiranraj_r@google.com",
        "role": "user",
        "password": "Pswd@123"
    }
    """
    user_dict = user.dict()
    result = await users_col.insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)
    return user_dict

@router.put("/{user_id}", response_model=UserModel)
async def update_user(
    user_id: str,
    user: UserUpdate,
    users_col: AsyncIOMotorCollection = Depends(get_user_collection),
    _: dict = Depends(require_admin)):
    """Admin only: Update user details.
    Example: PUT /users/1234
    Body: {"role": "admin"}
    """
    query_id = resolve_id(user_id)
    result = await users_col.update_one({"_id": query_id}, {"$set": user.dict(exclude_unset=True)})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    updated = await users_col.find_one({"_id": query_id})
    updated["id"] = str(updated["_id"])
    del updated["_id"]
    return updated

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    users_col: AsyncIOMotorCollection = Depends(get_user_collection),
    _: dict = Depends(require_admin)):
    """Admin only: Delete a user by ID.
    Example: DELETE /users/admin@ABC@000
    """
    query_id = resolve_id(user_id)
    result = await users_col.delete_one({"_id": query_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return None