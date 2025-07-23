# routers/auth.py
import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.encoders import jsonable_encoder
from config import USER_COL
from auth import verify_password, create_access_token, create_refresh_token, get_current_user
from database import get_database
from models.auth import Token, UserInDB, UserResponse
from config import USER_COL, LOCKOUT_DURATION_MINUTES
from datetime import timezone
from jose import jwt 
from config import SECRET_KEY, ALGORITHM

router = APIRouter(tags=["Authentication"])
logger = logging.getLogger(__name__)

@router.post("/api/v1/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_database)):
    user_doc = await db[USER_COL].find_one({"username": form_data.username})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    if user_doc.get("lockoutUntil") and user_doc["lockoutUntil"] > datetime.utcnow():
        raise HTTPException(status_code=403, detail="Account locked. Try later.")

    if not verify_password(form_data.password, user_doc["passwordHash"]):
        attempts = user_doc.get("failedLoginAttempts", 0) + 1
        update = {"$set": {"failedLoginAttempts": attempts}}
        if attempts >= user_doc.get("maxLoginAttempts", 5):
            
            update["$set"]["lockoutUntil"] = datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_DURATION_MINUTES)
            update["$set"]["failedLoginAttempts"] = 0
        await db[USER_COL].update_one({"username": form_data.username}, update)
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    await db[USER_COL].update_one(
        {"username": form_data.username},
        {"$set": {"failedLoginAttempts": 0, "lockoutUntil": None}}
    )

    access_token = create_access_token(form_data.username)
    refresh_token = create_refresh_token(form_data.username)
    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token}

@router.post("/api/v1/auth/refresh", response_model=Token)
async def refresh_token(request: Request, db=Depends(get_database)):
    refresh_token_str = request.headers.get("Authorization")
    if not refresh_token_str or not refresh_token_str.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing or malformed"
        )
    refresh_token_str = refresh_token_str.split(" ")[1]

    refresh_creds_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(refresh_token_str, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise refresh_creds_exc
    except jwt.JWTError:
        raise refresh_creds_exc

    user_doc = await db[USER_COL].find_one({"username": username})
    if not user_doc or (user_doc.get("lockoutUntil") and user_doc["lockoutUntil"] > datetime.utcnow()):
        raise refresh_creds_exc

    new_access_token = create_access_token(username)
    new_refresh_token = create_refresh_token(username) 

    return {
        "access_token": new_access_token,
        "token_type": "bearer",
        "refresh_token": new_refresh_token
    }

@router.get("/api/v1/users/me", response_model=UserResponse)
async def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    return UserResponse(**current_user.dict())