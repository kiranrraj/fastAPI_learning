from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from src.core.security import decode_token
from src.db.crud.user import get_user_by_id
from src.models.user_response import UserPublic
from src.core.logger import logger

# This tells FastAPI to extract the token from the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserPublic:
    " Extract and validate user from the Authorization Bearer token. "
    logger.info("[AUTH] Attempting to decode token...")

    try:
        user_id = decode_token(token)
        logger.debug(f"[AUTH] Decoded user_id from token: {user_id}")

        user = await get_user_by_id(user_id)
        if not user:
            logger.warning(f"[AUTH] User not found for ID: {user_id}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or no longer active."
            )

        logger.info(f"[AUTH] Authenticated user: {user.email}")
        return UserPublic(
            id=user.id,
            username=user.username,
            email=user.email,
            role=user.role,
            entity_access=user.entity_access,
            preferences=user.preferences,
        )

    except HTTPException as e:
        logger.warning(f"[AUTH] HTTP error during token verification: {e.detail}")
        raise e

    except Exception as e:
        logger.exception("[AUTH] Unexpected error during authentication.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token."
        )
