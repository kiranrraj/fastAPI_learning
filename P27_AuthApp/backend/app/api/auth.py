# app/api/auth.py

import bcrypt
import re
from jose import jwt, JWTError
from bson import ObjectId
from datetime import datetime, timedelta
from fastapi.responses import JSONResponse
from fastapi import APIRouter, HTTPException, status, Depends, Request, Response
from pydantic import BaseModel, EmailStr, Field, model_validator

from app.db.connection import get_database
from app.core.config import settings
from app.utils.token_storage import store_refresh_token, is_token_valid, delete_token

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., examples=["test@example.com"])
    password: str = Field(..., min_length=8, max_length=64)

    @model_validator(mode='after')
    def validate_password_complexity(self):
        password = self.password
        if not re.search(r"[A-Z]", password): raise ValueError("Password must have uppercase")
        if not re.search(r"[a-z]", password): raise ValueError("Password must have lowercase")
        if not re.search(r"\d", password): raise ValueError("Password must have digit")
        if not re.search(r"[!@#$%^&*()\-_=+|\\[\]{};:,.<>?/~`]", password):
            raise ValueError("Password must have special char")
        return self

def create_access_token(data: dict, expires_minutes: int = settings.ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def create_refresh_token(data: dict, expires_minutes: int = settings.REFRESH_TOKEN_EXPIRE_MINUTES):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

@router.post("/login")
async def login(credentials: LoginRequest, response: Response):
    db = get_database()
    user = await db["users"].find_one({"email": credentials.email})
    if not user or not bcrypt.checkpw(credentials.password.encode(), user["password"].encode()):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user_id = str(user["_id"])
    access_token = create_access_token({"sub": user_id})
    refresh_token = create_refresh_token({"sub": user_id})
    await store_refresh_token(user_id, refresh_token)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 7
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_id": user_id,
        "role": user["role"],
        "email": user["email"]
    }

@router.post("/refresh")
async def refresh_token(request: Request):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=400, detail="Missing refresh token")

    if not await is_token_valid(token):
        raise HTTPException(status_code=401, detail="Token is invalid or blacklisted")

    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        db = get_database()
        user = await db["users"].find_one({"_id": user_id})  # Secure check
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        new_access_token = create_access_token({"sub": user_id})
        return {"access_token": new_access_token, "token_type": "bearer"}

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@router.post("/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if token:
        await delete_token(token)

    response = JSONResponse(content={"message": "Logged out successfully"})
    response.delete_cookie("refresh_token", httponly=True, secure=False, samesite="lax")
    return response
