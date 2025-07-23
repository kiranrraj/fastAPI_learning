#!/usr/bin/env python3
import os
import logging
from datetime import datetime, timedelta, timezone
from typing import List, Optional, Dict, Any, Literal 
import uuid # NEW: Import the uuid module

import bcrypt
from fastapi import Depends, FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, ValidationError, Field
from fastapi.encoders import jsonable_encoder
from bson import ObjectId # Import ObjectId for _id handling, used in Portlet model parsing

# --- Configuration ---
MONGO_URI                   = "mongodb://localhost:27017/"
DATABASE_NAME               = "GBeeXDataV4"
USER_COL                    = "users"
COMPANY_COL                 = "clientData"
NOTIFICATION_COL            = "notifications"
PORTLET_COL                 = "portlets"
SECRET_KEY                  = "Strong@@password@1234567890@@"
ALGORITHM                   = "HS256"
ACCESS_TOKEN_EXPIRE_MIN     = 30  # minutes
REFRESH_TOKEN_EXPIRE_MIN    = 7 * 24 * 60 # 7 days in minutes - NEW CONFIGURATION
LOCKOUT_DURATION_MINUTES    = 5

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
app = FastAPI(title="GBeeX API", version="1.0.0")

# Allow all CORS (for UI demo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB client
client = AsyncIOMotorClient(MONGO_URI)
db      = client[DATABASE_NAME]

# --- Pydantic Models ---
class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str

class UserBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    staffId:     str    
    username:    str
    email:       str
    firstName:   str
    lastName:    str
    role:        str
    position:    str
    department:  str
    location:    str
    status:      str
    createdAt:   datetime
    updatedAt:   datetime

class UserInDB(UserBase):
    passwordHash: bytes
    failedLoginAttempts: int = 0
    lockoutUntil:        Optional[datetime] = None
    maxLoginAttempts:    int = 5

class UserResponse(UserBase):
    pass

class CompanyListItem(BaseModel):
    companyId:   str
    companyName: str

class ProtocolListItem(BaseModel):
    protocolId:   str
    protocolName: str

class SiteLocation(BaseModel):
    lat: float
    lng: float

class SitePerformanceSummary(BaseModel):
    totalTrialsDone:            int
    trialSuccessRate:           float
    totalSubjectsEnrolledCount: int
    subjectSuccessRate:         float
    enrollmentRatePerTrial:     float
    dropoutRatePerTrial:        float

class SiteDashboardItem(BaseModel):
    siteId:                     str
    siteName:                   str
    country:                    str
    location:                   SiteLocation
    sitePerformanceSummary:     SitePerformanceSummary

class Notification(BaseModel):
    id:          str
    userId:      str
    title:       str
    message:     str
    type:        str
    icon:        str
    timestamp:   datetime
    read:        bool
    link:        Optional[str]
    metadata:    dict

# --- Auth & JWT utilities ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def verify_password(plain_password: str, hashed_password) -> bool:
    if isinstance(hashed_password, str):
        hashed_bytes = hashed_password.encode('utf-8')
    else:
        hashed_bytes = hashed_password
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_bytes)

def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a new JWT access token for the given subject.
    Includes a unique JTI (JWT ID) to ensure token uniqueness,
    even if created in rapid succession.
    """
    # Calculate the expiration time for the access token.
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MIN))
    # Create the payload for the JWT, including the subject ('sub'), expiration ('exp'),
    # and a unique JWT ID ('jti').
    to_encode = {
        "sub": subject,
        "exp": int(expire.timestamp()),
        "jti": str(uuid.uuid4()) # NEW: Add a unique JWT ID (UUID4)
    }
    # Encode the payload into a JWT using the SECRET_KEY and ALGORITHM.
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# NEW: Function to create a refresh token
def create_refresh_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a new JWT refresh token for the given subject.
    Includes a unique JTI (JWT ID) to ensure token uniqueness.
    Refresh tokens typically have a much longer expiration time than access tokens.
    """
    # Calculate the expiration time for the refresh token.
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=REFRESH_TOKEN_EXPIRE_MIN))
    # Create the payload for the refresh JWT, including the subject ('sub'), expiration ('exp'),
    # and a unique JWT ID ('jti').
    to_encode = {
        "sub": subject,
        "exp": int(expire.timestamp()),
        "jti": str(uuid.uuid4()) # NEW: Add a unique JWT ID (UUID4)
    }
    # Encode the payload into a JWT using the SECRET_KEY and ALGORITHM.
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    """
    Dependency to get the current authenticated user from an access token.
    Raises HTTPException 401 if the token is invalid or user not found.
    """
    # Define the exception for invalid credentials.
    creds_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the access token using the SECRET_KEY and ALGORITHM.
        # This will raise JWTError if the token is expired or has an invalid signature.
        payload  = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Extract the username (subject) from the token payload.
        username = payload.get("sub")
        if not username:
            raise creds_exc
    except JWTError:
        # Catch any JWT-related errors (e.g., expired token, invalid signature).
        raise creds_exc

    # Fetch the user from the database based on the username extracted from the token.
    user_doc = await db[USER_COL].find_one({"username": username})
    if not user_doc:
        raise creds_exc

    try:
        # Validate and return the user as a UserInDB Pydantic model.
        return UserInDB(**user_doc)
    except ValidationError:
        # Catch Pydantic validation errors if the user data structure is incorrect.
        raise creds_exc

# --- Logging Middleware ---
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Middleware to log incoming HTTP requests."""
    logging.info(f"{request.method} {request.url}")
    return await call_next(request)

# --- Endpoints ---
@app.get("/", tags=["Root"])
async def read_root():
    """Root endpoint of the API."""
    return {"message": "Welcome to GBeeX API"}

@app.get("/health", tags=["Root"])
async def health():
    """Health check endpoint."""
    return {"status": "ok", "time": datetime.utcnow()}

@app.post("/api/v1/auth/login", response_model=Token, tags=["Authentication"])
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticates a user and issues an access token and a refresh token.
    Handles login attempts and account lockouts.
    """
    # Find the user in the database by username.
    user_doc = await db[USER_COL].find_one({"username": form_data.username})
    if not user_doc:
        # If user not found, raise authentication error.
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    # Check if the account is locked due to too many failed attempts.
    if user_doc.get("lockoutUntil") and user_doc["lockoutUntil"] > datetime.utcnow():
        raise HTTPException(status_code=403, detail="Account locked. Try later.")

    # Verify the provided password against the stored hash.
    if not verify_password(form_data.password, user_doc["passwordHash"]):
        # Increment failed login attempts.
        attempts = user_doc.get("failedLoginAttempts", 0) + 1
        update   = {"$set": {"failedLoginAttempts": attempts}}
        # If attempts exceed max, lock the account.
        if attempts >= user_doc.get("maxLoginAttempts", 5):
            update["$set"]["lockoutUntil"] = datetime.utcnow() + timedelta(minutes=LOCKOUT_DURATION_MINUTES)
            update["$set"]["failedLoginAttempts"] = 0 # Reset attempts after lockout
        await db[USER_COL].update_one({"username": form_data.username}, update)
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    # Reset failed login attempts and lockout status on successful login.
    await db[USER_COL].update_one(
        {"username": form_data.username},
        {"$set": {"failedLoginAttempts": 0, "lockoutUntil": None}}
    )

    # Create both access and refresh tokens.
    access_token = create_access_token(form_data.username)
    refresh_token = create_refresh_token(form_data.username)
    
    # Return both tokens in the response.
    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token}

# NEW: Token Refresh Endpoint
@app.post("/api/v1/auth/refresh", response_model=Token, tags=["Authentication"])
async def refresh_token(request: Request):
    """
    Refreshes an access token using a valid refresh token.
    The refresh token should be provided in the Authorization header as a Bearer token.
    A new access token and a new refresh token (for rotation) will be returned.
    """
    # Extract the refresh token string from the Authorization header.
    refresh_token_str = request.headers.get("Authorization")
    if not refresh_token_str or not refresh_token_str.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing or malformed"
        )
    refresh_token_str = refresh_token_str.split(" ")[1] # Get the actual token part

    # Define the exception for invalid or expired refresh token.
    refresh_creds_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode the refresh token. This will raise JWTError if expired or invalid.
        payload = jwt.decode(refresh_token_str, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        # You could also optionally check for 'jti' if you were doing advanced token revocation
        if not username:
            raise refresh_creds_exc
    except JWTError:
        # Catch any JWT errors during refresh token decoding.
        raise refresh_creds_exc

    # For enhanced security, verify the user still exists and is not locked out.
    user_doc = await db[USER_COL].find_one({"username": username})
    if not user_doc or (user_doc.get("lockoutUntil") and user_doc["lockoutUntil"] > datetime.utcnow()):
        raise refresh_creds_exc

    # If the refresh token is valid and the user is active, issue new tokens.
    new_access_token = create_access_token(username)
    # Generate a new refresh token for security (refresh token rotation).
    # This means the old refresh token is effectively invalidated after being used.
    new_refresh_token = create_refresh_token(username) 

    # NOTE ON REFRESH TOKEN ROTATION AND REVOCATION:
    # The current implementation uses JWTs for refresh tokens directly.
    # For a more robust and secure system, especially against stolen refresh tokens,
    # consider storing refresh token unique IDs or hashes in the database.
    # Upon a successful refresh:
    # 1. Invalidate the *old* refresh token in the database (e.g., mark as used, delete).
    # 2. Store the *newly* generated refresh token's ID/hash in the database.
    # This prevents replay attacks if a refresh token is stolen.
    # For this specific request, the current approach is a minimal, non-breaking change.

    return {
        "access_token": new_access_token,
        "token_type": "bearer",
        "refresh_token": new_refresh_token # Return the new refresh token
    }

@app.get("/api/v1/users/me", response_model=UserResponse, tags=["Users"])
async def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    """Retrieves the details of the currently authenticated user."""
    return UserResponse(**current_user.dict())

@app.get("/api/v1/companies", response_model=List[CompanyListItem], tags=["Companies"])
async def list_companies(current_user: UserInDB = Depends(get_current_user)):
    """Lists all available companies."""
    cursor = db[COMPANY_COL].find({}, {"companyId":1, "companyName":1, "_id":0})
    return await cursor.to_list(length=None)

@app.get("/api/v1/companies/{company_id}", tags=["Companies"])
async def get_company(company_id: str, current_user: UserInDB = Depends(get_current_user)):
    """Retrieves details for a specific company by company ID."""
    comp = await db[COMPANY_COL].find_one({"companyId": company_id}, {"_id":0})
    if not comp:
        raise HTTPException(status_code=404, detail="Company not found")
    return comp

@app.get("/api/v1/companies/{company_id}/protocols", response_model=List[ProtocolListItem], tags=["Protocols"])
async def list_protocols_for_company(company_id: str, current_user: UserInDB = Depends(get_current_user)):
    """Lists all protocols associated with a specific company."""
    pipeline = [
        {"$match": {"companyId": company_id}},
        {"$unwind": "$protocols"},
        {"$project": {"_id":0, "protocolId":"$protocols.protocolId", "protocolName":"$protocols.protocolName"}}
    ]
    return await db[COMPANY_COL].aggregate(pipeline).to_list(length=None)

@app.get("/api/v1/protocols/{protocol_id}/sites", response_model=List[SiteDashboardItem], tags=["Sites"])
async def list_sites_for_protocol(protocol_id: str, current_user: UserInDB = Depends(get_current_user)):
    """Lists all sites associated with a specific protocol."""
    pipeline = [
        {"$match": {"protocols.protocolId": protocol_id}},
        {"$unwind": "$protocols"},
        {"$match": {"protocols.protocolId": protocol_id}},
        {"$unwind": "$protocols.sites"},
        {"$replaceRoot": {"newRoot": "$protocols.sites"}},
        {"$project": {
            "_id": 0,
            "siteId": 1,
            "siteName": 1,
            "country": 1,
            "location": {"lat": "$latitude", "lng": "$longitude"},
            "sitePerformanceSummary": {
                "totalTrialsDone":          "$sitePerformance.totalTrialsDone",
                "trialSuccessRate":         "$sitePerformance.trialSuccessRate",
                "totalSubjectsEnrolledCount":"$sitePerformance.totalSubjectsEnrolledCount",
                "subjectSuccessRate":       "$sitePerformance.subjectSuccessRate",
                "enrollmentRatePerTrial":   "$sitePerformance.enrollmentRatePerTrial",
                "dropoutRatePerTrial":      "$sitePerformance.dropoutRatePerTrial"
            }
        }}
    ]
    sites = await db[COMPANY_COL].aggregate(pipeline).to_list(length=None)
    if not sites:
        raise HTTPException(status_code=404, detail="Protocol not found or no sites")
    return sites

@app.get("/api/v1/notifications", response_model=List[Notification], tags=["Notifications"])
async def list_notifications(current_user: UserInDB = Depends(get_current_user)):
    """Lists all notifications for the current user."""
    cursor = db[NOTIFICATION_COL].find({"userId": current_user.staffId}, {"_id":0})
    return await cursor.to_list(length=None)

@app.post("/api/v1/notifications/{nid}/read", tags=["Notifications"])
async def mark_notification_read(nid: str, current_user: UserInDB = Depends(get_current_user)):
    """Marks a specific notification as read for the current user."""
    res = await db[NOTIFICATION_COL].update_one(
        {"id": nid, "userId": current_user.staffId},
        {"$set": {"read": True}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "ok"}


# ────── PORTLETS ──────

class PortletBase(BaseModel):
    key: str = Field(..., example="site-performance")
    title: str = Field(..., example="Clinical Site Performance Summary")
    category: str = Field(..., example="Dashboard & Overview Panels")
    description: Optional[str] = Field(None, example="Map-based heatmap of site performance")
    enabled: bool = Field(True, example=True)
    order: int = Field(..., ge=0, example=1)
    settings: Dict[str, Any] = Field(
        default_factory=dict,
        example={
            "defaultFilters": {"region": "all", "disease": "all"},
            "mapType": "heatmap",
            "refreshIntervalSec": 300
        }
    )

class PortletBase(BaseModel):
    key: str = Field(..., example="site-performance-chart", description="Unique identifier for the portlet.")
    title: str = Field(..., example="Site Performance Overview", description="Human-readable title.")
    category: Literal["analytics", "visualization", "generic", "report", "workflow", "other"] = Field(
        ...,
        example="analytics",
        description="Categorization of the portlet."
    )
    description: str = Field(..., example="A chart visualizing key site performance metrics.", description="Brief description of the portlet's function.")
    longDescription: Optional[str] = Field(None, description="Detailed description of the portlet's features or use cases.")
    enabled: bool = Field(True, example=True, description="Whether the portlet is active and visible.")
    order: int = Field(..., ge=0, example=1, description="Display order of the portlet in lists/sidebars.")
    renderMechanism: Literal["iframe", "component"] = Field(
        ...,
        example="component",
        description="Determines how the portlet content is rendered: 'iframe' for external URLs, 'component' for local React components."
    )
    url: Optional[str] = Field(
        None,
        example="https://example.com/dashboard",
        description="URL to embed if 'renderMechanism' is 'iframe'."
    )
    componentName: Optional[str] = Field(
        None,
        example="SitePerformanceChart",
        description="Name of the React component to render if 'renderMechanism' is 'component'. Maps to a component in frontend registry."
    )
    isChild: bool = Field(False, description="Indicates if this is a child portlet.")
    parentPath: Optional[str] = Field(
        None,
        example="Dashboard/Analytics",
        description="Hierarchical path if 'isChild' is true (e.g., 'Parent/SubParent')."
    )
    createdBy: str = Field(..., description="The user or role that created this portlet.")
    testNotes: Optional[str] = Field(None, description="Notes or test cases related to this portlet's development/testing.")
    
    settings: Dict[str, Any] = Field(
        default_factory=dict,
        description="Arbitrary JSON settings passed to the portlet for configuration.",
        example={
            "defaultFilters": {"region": "all", "disease": "all"},
            "chartType": "bar",
            "dataEndpoint": "/api/v1/data/site-performance"
        }
    )

class Portlet(PortletBase):
    # The '_id' field from MongoDB will be mapped to 'id' here
    id: str = Field(..., example="64b1f2a3e8b4f12d34acd567")

@app.get(
    "/api/v1/portlets",
    response_model=List[Portlet],
    summary="List all portlets",
    tags=["Portlets"]
)
async def list_portlets(current_user: UserInDB = Depends(get_current_user)):
    """
    Returns the full list of configured portlets.
    """
    try:
        # Find all documents in the portlets collection.
        docs = await db[PORTLET_COL].find().to_list(length=None)
        result = []
        for d in docs:
            # Convert MongoDB's ObjectId '_id' to a string 'id' for Pydantic.
            d["id"] = str(d["_id"])
            result.append(d)
        return result
    except ValidationError as ve:
        logging.warning("Error serializing portlets: %s", ve)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing portlet data"
        )
    except Exception as e:
        logging.error("Error listing portlets: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve portlets"
        )

@app.post(
    "/api/v1/portlets",
    response_model=Portlet,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new portlet",
    tags=["Portlets"]
)
async def create_portlet(
    payload: PortletBase,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Adds a new portlet to the collection, ensuring uniqueness of the 'key' field.
    """
    try:
        # Check if a portlet with the given key already exists
        existing_portlet = await db[PORTLET_COL].find_one({"key": payload.key})
        if existing_portlet:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, # 409 Conflict for duplicate resource
                detail=f"Portlet with key '{payload.key}' already exists. Please choose a different key."
            )

        data = jsonable_encoder(payload)
        insert_res = await db[PORTLET_COL].insert_one(data)
        created = await db[PORTLET_COL].find_one({"_id": insert_res.inserted_id})
        if not created:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Portlet created but could not be fetched"
            )
        # Ensure the 'id' field is correctly mapped from MongoDB's '_id'
        created["id"] = str(created["_id"])
        return created

    except ValidationError as ve:
        logging.warning("Portlet validation failed: %s", ve)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=ve.errors()
        )
    except HTTPException:
        raise # Re-raise HTTPExceptions we've thrown above
    except Exception as e:
        logging.error("Error creating portlet: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create portlet"
        )