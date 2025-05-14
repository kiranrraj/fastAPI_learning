from fastapi import APIRouter, HTTPException
from models.user_model import UserModel
from db.mongo import db
from utils.auth import register_token
import uuid

router = APIRouter()

@router.post("/signup")
async def signup(user: UserModel):
    existing = await db.users.find_one(
        {"username" : user.username}
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail=" User already exists"
        )
    await db.users.insert_one(user.model_dump())
    return {"message" : "User created"}

@router.post("/login")
async def login(user: UserModel):
    db_user = await db.users.find_one({
        "username" : user.username,
        "password" : user.password
    })
    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials"
        )
    token = str(uuid.uuid4())
    register_token(user.username, token)
    return{"token" : token}