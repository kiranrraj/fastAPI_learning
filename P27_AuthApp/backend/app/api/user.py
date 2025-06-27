# app/api/user.py

import bcrypt
import logging
from typing import List
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from fastapi import APIRouter, HTTPException, status, Depends

from app.models.user import UserModel, UserCreate, UserUpdate
from app.db.connection import get_database
from app.dependencies import get_current_user, verify_admin_user
from app.utils.resolve_id import resolve_id

# ───────────────────────────────────────────────────────────
# Constants
MAX_USERS_LIMIT = 100
DEFAULT_SKIP = 0
DEFAULT_LIMIT = 20
# ───────────────────────────────────────────────────────────

# Logger
logger = logging.getLogger("user-api")
logger.setLevel(logging.INFO)

router = APIRouter(prefix="/users", tags=["users"])

# ───────────────────────────────────────────────────────────
# Dependencies
async def get_user_collection() -> AsyncIOMotorCollection:
    db = get_database()
    return db["users"]

# ───────────────────────────────────────────────────────────
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

# ───────────────────────────────────────────────────────────
@router.get("/", response_model=List[UserModel])
async def list_users(
    skip: int = DEFAULT_SKIP,
    limit: int = DEFAULT_LIMIT,
    users_col: AsyncIOMotorCollection = Depends(get_user_collection),
    current_user: dict = Depends(verify_admin_user),
):
    """Admin only: Paginated list of users."""
    limit = min(limit, MAX_USERS_LIMIT)
    users = await users_col.find({}).skip(skip).limit(limit).to_list(length=limit)
    logger.info(f"Admin {current_user.get('email')} fetched user list: skip={skip}, limit={limit}")
    for u in users:
        u["id"] = str(u["_id"])
        del u["_id"]
    return users

@router.get("/me", response_model=UserModel)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Authenticated users only: Fetch their own profile."""
    user_copy = current_user.copy()
    user_copy["id"] = str(user_copy["_id"])
    del user_copy["_id"]
    logger.info(f"User {user_copy['email']} fetched their profile.")
    return user_copy

@router.get("/{user_id}", response_model=UserModel)
async def get_user(
    user_id: str,
    users_col: AsyncIOMotorCollection = Depends(get_user_collection),
    current_user: dict = Depends(verify_admin_user)):
    """Admin only: Get user by ID."""
    query_id = resolve_id(user_id)
    user = await users_col.find_one({"_id": query_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["id"] = str(user["_id"])
    del user["_id"]
    logger.info(f"Admin {current_user.get('email')} fetched user: {user_id}")
    return user

@router.post("/", response_model=UserModel, status_code=status.HTTP_201_CREATED)
async def create_user(
    user: UserCreate,
    users_col: AsyncIOMotorCollection = Depends(get_user_collection),
    current_user: dict = Depends(verify_admin_user),
):
    """Admin only: Create a new user."""
    user_dict = user.dict()
    hashed_pw = bcrypt.hashpw(user_dict["password"].encode(), bcrypt.gensalt()).decode()
    user_dict["password"] = hashed_pw

    result = await users_col.insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)
    logger.info(f"Admin {current_user.get('email')} created new user: {user_dict['email']}")
    return user_dict

@router.put("/{user_id}", response_model=UserModel)
async def update_user(
    user_id: str,
    user: UserUpdate,
    users_col: AsyncIOMotorCollection = Depends(get_user_collection),
    current_user: dict = Depends(verify_admin_user),
):
    """Admin only: Update user details."""
    query_id = resolve_id(user_id)
    result = await users_col.update_one({"_id": query_id}, {"$set": user.dict(exclude_unset=True)})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    updated = await users_col.find_one({"_id": query_id})
    updated["id"] = str(updated["_id"])
    del updated["_id"]
    logger.info(f"Admin {current_user.get('email')} updated user: {user_id}")
    return updated

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    current_user: dict = Depends(verify_admin_user),
    users_col: AsyncIOMotorCollection = Depends(get_user_collection),
):
    """Admin only: Delete a user by ID."""
    query_id = resolve_id(user_id)

    if str(current_user["_id"]) == str(query_id):
        logger.warning(f"Admin {current_user.get('email')} attempted to delete themselves.")
        raise HTTPException(status_code=403, detail="Admins cannot delete themselves")

    result = await users_col.delete_one({"_id": query_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    logger.info(f"Admin {current_user.get('email')} deleted user: {user_id}")
    return None

@router.patch("/{user_id}/deactivate")
async def deactivate_user(
    user_id: str,
    users_col: AsyncIOMotorCollection = Depends(get_user_collection),
    current_user: dict = Depends(verify_admin_user),
):
    """Admin only: Deactivate a user (set status to 'inactive')."""
    query_id = resolve_id(user_id)
    result = await users_col.update_one({"_id": query_id}, {"$set": {"status": "inactive"}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    logger.info(f"Admin {current_user.get('email')} deactivated user: {user_id}")
    return {"message": f"User {user_id} deactivated."}

@router.patch("/{user_id}/activate")
async def activate_user(
    user_id: str,
    users_col: AsyncIOMotorCollection = Depends(get_user_collection),
    current_user: dict = Depends(verify_admin_user),
):
    """Admin only: Activate a user (set status to 'active')."""
    query_id = resolve_id(user_id)
    result = await users_col.update_one({"_id": query_id}, {"$set": {"status": "active"}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    logger.info(f"Admin {current_user.get('email')} activated user: {user_id}")
    return {"message": f"User {user_id} activated."}