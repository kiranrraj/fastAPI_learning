# app/security/dependencies.py
from typing import List, Optional 

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorClient

from app.database import get_database
from app.models.user import UserInDB, Role
from app.security.jwt_handler import decode_access_token
from app.utils.logger import get_logger

logger = get_logger(__name__)

# This creates an instance of the OAuth2PasswordBearer class.
# tokenUrl="auth/token": not the actual endpoint that verifies tokens,
# but rather the URL where a client can obtain a token.

# It checks the Authorization header in the incoming request.
# It expects the header to look like: Authorization: Bearer YOUR_SUPER_SECRET_TOKEN_STRING.
# If successful: It grabs just YOUR_SUPER_SECRET_TOKEN_STRING and passes it on.
# If failed: If the header is missing, malformed, or doesn't start with Bearer, it automatically
# stops the request and sends back a 401 UNAUTHORIZED error.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

# Given a username (which we'll get from the ticket), this function
# quickly looks up the full user record in your MongoDB database.
# It connects to your MongoDB (via the db object).
# It goes to the users collection.
# It searches for a document where the username matches.
# If it finds the user, it takes the raw data from MongoDB and turns it into a UserInDB object.
# This is important because UserInDB knows how to handle MongoDB's special _id field.
# If no user is found, it returns None.
async def get_user_from_db(username: str, db: AsyncIOMotorClient) -> Optional[UserInDB]:
    users_collection = db["users"]
    try:
        user_data = await users_collection.find_one({"username": username})
        if user_data:
            logger.debug(f"User '{username}' found in database.")
            # Ensure UserInDB initialization correctly handles the role from DB
            return UserInDB(**user_data)
        logger.debug(f"User '{username}' not found in database during lookup.")
        return None
    except Exception as e:
        logger.error(f"Database error while fetching user '{username}': {e}", exc_info=True)
        # Re-raise as HTTPException to inform client of a server error, not to leak DB specifics
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred while retrieving user data."
        )

# Core Authentication Dependency
# To figure out who the current user is based on their provided JWT, and
# to make sure that token is valid and belongs to a real, active user in
# your database.

# First, it uses the oauth2_scheme to get the raw token string from the
# request's Authorization header. If oauth2_scheme fails, this function
# won't even run; FastAPI handles the 401.
# It also automatically gets the database connection from your get_database dependency.
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncIOMotorClient = Depends(get_database)
) -> UserInDB:

    # This is just a pre-defined error message and status code
    # (401 UNAUTHORIZED) that it will use if it finds a problem with the
    # user's "credentials" (their token or user data).
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Calls the decode_access_token function (from jwt_handler.py) to
    # parse the JWT. If the token is invalid (malformed, expired,
    # invalid signature), decode_access_token returns None
    token_data = decode_access_token(token)

    # Checks if decoding failed or if the essential username
    # claim is missing from the token. If so, it raises the 401
    # Unauthorized error.
    if token_data is None: 
        logger.warning("Token decoding failed (e.g., invalid signature, expired).")
        raise credentials_exception
    
    if token_data.username is None:
        logger.warning("JWT payload missing 'username' claim, cannot identify user.")
        raise credentials_exception

    # Fetch user from database using username from token
    user = await get_user_from_db(token_data.username, db)
    if user is None:
        logger.warning(f"User '{token_data.username}' from token not found in database (user may have been deleted).")
        raise credentials_exception

    # Convert token_data.role (which is a string) to a Role Enum for comparison.
    try:
        token_role_enum = Role(token_data.role)
    except ValueError:
        logger.warning(f"Invalid role '{token_data.role}' found in JWT payload for user '{token_data.username}'.")
        raise credentials_exception # Token has invalid role string

    if user.role != token_role_enum: # Compare Enum to Enum
        logger.warning(f"Role mismatch for user '{token_data.username}': Token has '{token_data.role}', DB has '{user.role.value}'.")
        raise credentials_exception

    logger.info(f"User '{user.username}' successfully authenticated. Role: {user.role.value}") # Use .value for logging Enum
    return user


def require_roles(roles: list[str]):
    # This is the actual dependency function that require_roles returns.
    async def role_checker(current_user: UserInDB = Depends(get_current_user)):

        # Convert required roles strings to Role Enum values for comparison
        # This handles cases where roles might be passed as simple strings (e.g., ["admin"])
        # but are compared against the Enum type of current_user.role
        try:
            required_role_enums = [Role(r) for r in roles]
        except ValueError:
            logger.error(f"Invalid role string provided to require_roles: {roles}. This indicates a code error.")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Server configuration error with roles."
            )
        
        # It checks if the current_user's role (from the UserInDB object
        # fetched from the DB) is present in the roles list passed to
        # the factory. If the user's role is not among the allowed roles,
        # it raises a 403 Forbidden HTTP exception.
        if current_user.role not in required_role_enums:
            logger.warning(f"User '{current_user.username}' (Role: {current_user.role.value}) attempted unauthorized access to roles: {', '.join(roles)}.")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Not enough permissions. Required roles: {', '.join(roles)}",
            )
        logger.debug(f"User '{current_user.username}' has required role(s): {current_user.role.value} in {', '.join(roles)}") 
        return current_user
    return role_checker

# These three async def functions are FastAPI dependencies that provide a convenient way to
# enforce role-based access control (RBAC) on your API endpoints.
async def get_current_admin_user(
    current_user: UserInDB = Depends(require_roles([Role.ADMIN.value])) # CORRECTED: Use Role Enum .value
):
    logger.debug(f"Current user '{current_user.username}' is an admin.") 
    return current_user

# To ensure only a doctor OR an admin user can access the endpoint.
async def get_current_doctor_user(
    current_user: UserInDB = Depends(require_roles([Role.DOCTOR.value, Role.ADMIN.value])) # CORRECTED: Use Role Enum .value
):
    logger.debug(f"Current user '{current_user.username}' is a doctor or admin.") 
    return current_user

# To ensure only a testcenter OR an admin user can access the endpoint.
async def get_current_testcenter_user(
    current_user: UserInDB = Depends(require_roles([Role.TESTCENTER.value, Role.ADMIN.value])) # CORRECTED: "testCenter" -> Role.TESTCENTER.value
):
    logger.debug(f"Current user '{current_user.username}' is a test center user or admin.") 
    return current_user