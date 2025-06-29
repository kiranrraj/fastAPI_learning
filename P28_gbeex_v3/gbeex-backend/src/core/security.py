# src/core/security.py

from datetime import datetime, timedelta
from jose import jwt, JWTError, ExpiredSignatureError
from fastapi import HTTPException, status
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorCollection

from src.core.config import config
from src.db.mongo import mongo

BLACKLIST_COLLECTION = "blacklisted_tokens"

# Create a bcrypt context for password hashing/verification
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    " Compare a plaintext password with its hashed version using bcrypt. "
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    " Hash a plaintext password securely using bcrypt before saving to DB. "
    return pwd_context.hash(password)


def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    " Create a short-lived JWT access token for the authenticated user. "
    if expires_delta is None:
        expires_delta = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)

    expire = datetime.utcnow() + expires_delta

    payload = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.utcnow(),
    }

    return jwt.encode(
        payload,
        config.JWT_SECRET_KEY,
        algorithm=config.JWT_ALGORITHM
    )


def create_refresh_token(subject: str, expires_delta: timedelta | None = None) -> str:
    " Create a long-lived refresh token to renew access tokens without login. "
    if expires_delta is None:
        expires_delta = timedelta(minutes=config.REFRESH_TOKEN_EXPIRE_MINUTES)

    expire = datetime.utcnow() + expires_delta

    payload = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.utcnow(),
    }

    return jwt.encode(
        payload,
        config.JWT_SECRET_KEY,
        algorithm=config.JWT_ALGORITHM
    )


def decode_token(token: str) -> str:
    " Decode and validate a JWT token. Extracts and returns the subject (user ID/email). "
    try:
        payload = jwt.decode(
            token,
            config.JWT_SECRET_KEY,
            algorithms=[config.JWT_ALGORITHM],
        )
        return payload.get("sub")
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )


async def refresh_tokens(old_refresh_token: str) -> tuple[str, str, str]:
    """
    Handle refresh token rotation securely:
    - Verify token is not blacklisted.
    - Decode it.
    - Blacklist old token.
    - Issue new access and refresh tokens.
    """
    if await is_token_blacklisted(old_refresh_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is blacklisted",
        )

    user_id = decode_token(old_refresh_token)

    await blacklist_token(old_refresh_token)

    new_access_token = create_access_token(subject=user_id)
    new_refresh_token = create_refresh_token(subject=user_id)

    return user_id, new_access_token, new_refresh_token


async def blacklist_token(token: str) -> None:
    " Store a refresh token in the blacklist collection. "

    if mongo.db_instance is None:
        raise RuntimeError("MongoDB is not connected")

    collection: AsyncIOMotorCollection = mongo.db_instance[BLACKLIST_COLLECTION]

    await collection.insert_one({
        "token": token,
        "blacklisted_at": datetime.utcnow()
    })


async def is_token_blacklisted(token: str) -> bool:
    "Check whether a refresh token has already been used or blacklisted."

    if mongo.db_instance is None:
        raise RuntimeError("MongoDB is not connected")

    collection: AsyncIOMotorCollection = mongo.db_instance[BLACKLIST_COLLECTION]
    result = await collection.find_one({"token": token})
    return result is not None
