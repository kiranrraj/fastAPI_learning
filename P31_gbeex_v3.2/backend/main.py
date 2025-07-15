# main.py
# A complete FastAPI application for the GBeeX demo backend.
# This version includes all required Pydantic models and security logic.
# To run:
# 1. pip install "fastapi[all]" motor python-jose[cryptography] "passlib[bcrypt]"
# 2. uvicorn main:app --reload

import os
import logging
from datetime import datetime, timedelta, timezone
from typing import List, Optional

import bcrypt
from fastapi import Depends, FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, ValidationError

# --- Configuration ---
MONGO_URI = "mongodb://localhost:27017/"
DATABASE_NAME = "GBeeXData"
USER_COLLECTION = "userData"
COMPANY_COLLECTION = "clientData"
SECRET_KEY = "@password@1234567890@@password@1234567890"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
LOCKOUT_DURATION_MINUTES = 5 

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI(title="GBeeX API", version="1.2.3") 

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logging.info(f"Incoming Request: {request.method} {request.url}")
    response = await call_next(request)
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]

# --- Pydantic Models ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    userId: str
    username: str
    email: str
    firstname: str
    lastname: str
    role: str
    gender: str
    age: int
    location: str
    activated: bool
    createdAt: datetime
    expirationDate: datetime
    companyId: Optional[str] = None
    companyName: Optional[str] = None


class UserInDB(UserBase):
    passwordHash: str
    failedLoginAttempts: int = 0
    lockoutUntil: Optional[datetime] = None
    maxLoginAttempts: int = 5

class UserResponse(UserBase):
    pass

class CompanyListItem(BaseModel):
    companyId: str
    companyName: str

class ProtocolListItem(BaseModel):
    protocolId: str
    protocolName: str

class SitePerformanceSummary(BaseModel):
    status: str
    enrollmentRatePerMonth: float
    totalEnrolled: int
    totalCompleted: int
    totalWithdrawn: int
    totalScreenFailures: int
    avgDataEntryLagDays: float

class SiteLocation(BaseModel):
    lat: float
    lng: float

class SiteDashboardItem(BaseModel):
    siteId: str
    siteName: str
    country: str
    location: SiteLocation
    sitePerformanceSummary: SitePerformanceSummary

# --- Security and Authentication ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    logging.info(f"[DB QUERY] get_current_user: Finding user '{username}' in '{USER_COLLECTION}'")
    user_doc = await db[USER_COLLECTION].find_one({"username": username})
    
    if user_doc is None:
        raise credentials_exception
    
    try:
        return UserInDB(**user_doc)
    except ValidationError as e:
        logging.error("--- Pydantic Validation Error in get_current_user ---")
        logging.error(f"User document that failed validation: {user_doc}")
        logging.error(e)
        logging.error("----------------------------------------------------")
        raise credentials_exception

# --- API Endpoints ---
@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the GBeeX API"}

@app.post("/api/v1/auth/login", response_model=Token, tags=["Authentication"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    logging.info(f"[DB QUERY] login: Finding user '{form_data.username}' in '{USER_COLLECTION}'")
    user_doc = await db[USER_COLLECTION].find_one({"username": form_data.username})

    if not user_doc:
        logging.warning(f"Login attempt for non-existent user: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    
    if user_doc.get("lockoutUntil") and user_doc.get("lockoutUntil") > datetime.utcnow():
        logging.warning(f"Login attempt for locked account: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account locked. Please try again later."
        )

    if not verify_password(form_data.password, user_doc["passwordHash"]):
        logging.warning(f"Failed login attempt for user: {form_data.username}")
        new_attempts = user_doc.get("failedLoginAttempts", 0) + 1
        max_attempts = user_doc.get("maxLoginAttempts", 5)
        update_data = {"$set": {"failedLoginAttempts": new_attempts}}

        if new_attempts >= max_attempts:
            lockout_time = datetime.utcnow() + timedelta(minutes=LOCKOUT_DURATION_MINUTES)
            update_data["$set"]["lockoutUntil"] = lockout_time
            update_data["$set"]["failedLoginAttempts"] = 0 
            logging.warning(f"Locking account for user: {form_data.username}")
            
        await db[USER_COLLECTION].update_one({"username": form_data.username}, update_data)
        
        if "lockoutUntil" in update_data["$set"]:
             raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Account locked for {LOCKOUT_DURATION_MINUTES} minutes due to too many failed attempts."
            )
        else:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
            )

    logging.info(f"Successful login for user: {form_data.username}. Resetting failure count.")
    await db[USER_COLLECTION].update_one(
        {"username": form_data.username},
        {"$set": {"failedLoginAttempts": 0, "lockoutUntil": None}}
    )

    access_token = create_access_token(
        data={"sub": user_doc["username"]}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/v1/users/me", response_model=UserResponse, tags=["Users"])
async def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    return UserResponse(**current_user.dict())

# @app.get("/api/v1/companies", response_model=List[CompanyListItem], tags=["Companies"])
# async def list_all_companies(current_user: UserInDB = Depends(get_current_user)):
#     logging.info(f"[DB QUERY] list_all_companies: Finding all companies in '{COMPANY_COLLECTION}'")
#     companies_cursor = db[COMPANY_COLLECTION].find({}, {"companyId": 1, "companyName": 1, "_id": 0})
#     return await companies_cursor.to_list(length=None)

# Testing no auth
@app.get("/api/v1/dev/companies", tags=["Testing (No Auth)"])
async def list_full_companies_for_dev():
    logging.info(f"[DB QUERY] DEV: Fetching full company documents from '{COMPANY_COLLECTION}'")
    companies_cursor = db[COMPANY_COLLECTION].find({}, {"_id": 0})  # No projection — fetch everything
    return await companies_cursor.to_list(length=None)


@app.get("/api/v1/companies/{company_id}", response_model=dict, tags=["Companies"])
async def get_company_details(company_id: str, current_user: UserInDB = Depends(get_current_user)):
    logging.info(f"[DB QUERY] get_company_details: Finding companyId '{company_id}'")
    company = await db[COMPANY_COLLECTION].find_one({"companyId": company_id}, {"_id": 0})
    if company:
        return company
    raise HTTPException(status_code=404, detail="Company not found")

@app.get("/api/v1/companies/{company_id}/protocols", response_model=List[ProtocolListItem], tags=["Protocols"])
async def list_protocols_for_company(company_id: str, current_user: UserInDB = Depends(get_current_user)):
    logging.info(f"[DB QUERY] list_protocols_for_company: Aggregating protocols for companyId '{company_id}'")
    pipeline = [
        {"$match": {"companyId": company_id}},
        {"$unwind": "$protocols"},
        {"$project": {
            "_id": 0,
            "protocolId": "$protocols.protocolId",
            "protocolName": "$protocols.protocolName"
        }}
    ]
    protocols_cursor = db[COMPANY_COLLECTION].aggregate(pipeline)
    return await protocols_cursor.to_list(length=None)

@app.get("/api/v1/protocols/{protocol_id}/sites", response_model=List[SiteDashboardItem], tags=["Sites"])
async def get_sites_for_protocol(protocol_id: str, current_user: UserInDB = Depends(get_current_user)):
    logging.info(f"[DB QUERY] get_sites_for_protocol: Aggregating sites for protocolId '{protocol_id}'")
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
            "location": 1,
            "sitePerformanceSummary": 1
        }}
    ]
    sites_cursor = db[COMPANY_COLLECTION].aggregate(pipeline)
    results = await sites_cursor.to_list(length=None)
    if not results:
         raise HTTPException(status_code=404, detail="Protocol not found or has no sites")
    return results
