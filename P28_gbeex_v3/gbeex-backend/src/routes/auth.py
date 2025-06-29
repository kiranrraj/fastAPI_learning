# src/routes/auth.py

from fastapi import APIRouter, HTTPException, status, Response, Cookie, Depends
from fastapi.responses import JSONResponse

from src.db.crud.user import get_user_by_id
from src.core.dependencies import get_current_user
from src.models.user_response import UserPublic, TokenResponse
from src.models.user_model import LoginRequest
from src.db.crud.user import get_user_by_email
from src.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    refresh_tokens,
    blacklist_token,
    is_token_blacklisted,
)
from src.core.logger import logger


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, response: Response):
    """
    Authenticate the user and return access + refresh tokens.
    Refresh token is stored as secure HttpOnly cookie.

    Raises:
        401 - Invalid email or password
    """
    logger.info(f"[LOGIN] Attempt by {request.email}")

    try:
        user = await get_user_by_email(request.email)
    except Exception as e:
        logger.error(f"[LOGIN] DB error while retrieving user: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

    if not user:
        logger.warning(f"[LOGIN] Failed - user not found: {request.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(request.password, user.password):
        logger.warning(f"[LOGIN] Failed - invalid password for: {request.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generate tokens
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)

    # Set HttpOnly refresh cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=60 * 60 * 24 * 7,
        path="/",
    )

    logger.info(f"[LOGIN] Success for user: {user.email}")

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserPublic(
            id=user.id,
            username=user.username,
            email=user.email,
            role=user.role,
            entity_access=user.entity_access,
            preferences=user.preferences,
        )
    )


# @router.post("/refresh", response_model=TokenResponse)
# async def refresh_token(response: Response, refresh_token: str = Cookie(None)):
#     "Rotate and return a new access token and refresh token. Refresh token is validated, blacklisted, and replaced."
#     if not refresh_token:
#         logger.warning("[REFRESH] Missing refresh token in cookie.")
#         raise HTTPException(status_code=401, detail="Missing refresh token.")

#     try:
#         # Ensure token is not reused
#         if await is_token_blacklisted(refresh_token):
#             logger.warning("[REFRESH] Reused or blacklisted token.")
#             raise HTTPException(status_code=401, detail="Invalid refresh token.")

#         user_id, new_access_token, new_refresh_token = await refresh_tokens(refresh_token)
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         logger.exception("[REFRESH] Unexpected error during token refresh.")
#         raise HTTPException(status_code=500, detail="Token refresh failed")

#     # Set the new refresh token in cookie
#     response.set_cookie(
#         key="refresh_token",
#         value=new_refresh_token,
#         httponly=True,
#         secure=True,
#         samesite="strict",
#         max_age=60 * 60 * 24 * 7,
#         path="/",
#     )

#     logger.info(f"[REFRESH] Token refreshed for user: {user_id}")

#     return TokenResponse(
#         access_token=new_access_token,
#         refresh_token=new_refresh_token,
#         user=UserPublic( 
#             id=user_id,
#             username="",
#             email="",
#             role="",
#             entity_access=[],
#             preferences=None
#         )
#     )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(response: Response, refresh_token: str = Cookie(None)):
    "Rotate and return a new access token and refresh token."
    if not refresh_token:
        logger.warning("[REFRESH] Missing refresh token in cookie.")
        raise HTTPException(status_code=401, detail="Missing refresh token.")

    try:
        # Ensure token is not reused
        if await is_token_blacklisted(refresh_token):
            logger.warning("[REFRESH] Reused or blacklisted token.")
            raise HTTPException(status_code=401, detail="Invalid refresh token.")

        user_id, new_access_token, new_refresh_token = await refresh_tokens(refresh_token)
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.exception("[REFRESH] Unexpected error during token refresh.")
        raise HTTPException(status_code=500, detail="Token refresh failed")

    #Set the new refresh token in the cookie 
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=60 * 60 * 24 * 7,  
        path="/",
    )

    #Load full user data
    user = await get_user_by_id(user_id)
    if not user:
        logger.error(f"[REFRESH] User not found for ID: {user_id}")
        raise HTTPException(status_code=404, detail="User not found during refresh.")

    user_public = UserPublic(
        id=user.id,
        username=user.username,
        email=user.email,
        role=user.role,
        entity_access=user.entity_access,
        preferences=user.preferences,
    )

    logger.info(f"[REFRESH] Token refreshed for user: {user.email}")

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
        user=user_public,
    )


@router.post("/logout")
async def logout(response: Response, refresh_token: str = Cookie(None)):
    """
    Log out user by blacklisting the refresh token and clearing the cookie.

    Notes:
        If no token is found, we still return 200.
    """
    if refresh_token:
        try:
            await blacklist_token(refresh_token)
            logger.info("[LOGOUT] Refresh token blacklisted.")
        except Exception as e:
            logger.error(f"[LOGOUT] Failed to blacklist token: {e}", exc_info=True)
            # Continue anyway to clear cookie
    else:
        logger.info("[LOGOUT] No refresh token found in cookie.")

    # Always clear cookie
    response.delete_cookie(
        key="refresh_token",
        path="/",
        samesite="strict"
    )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "Successfully logged out."}
    )

@router.get("/me", response_model=UserPublic)
async def get_me(current_user: UserPublic = Depends(get_current_user)):
    """
    Return the currently authenticated user's public profile.
    """
    return current_user
