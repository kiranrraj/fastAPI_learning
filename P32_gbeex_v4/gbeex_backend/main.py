#!/usr/bin/env python3
import os
import logging
from datetime import datetime, timedelta
from typing import List, Optional

import bcrypt
from fastapi import Depends, FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, ValidationError

# --- Configuration ---
MONGO_URI                = "mongodb://localhost:27017/"
DATABASE_NAME            = "GBeeXDataV4"
USER_COL                 = "users"
COMPANY_COL              = "clientData"
NOTIFICATION_COL         = "notifications"
SECRET_KEY               = os.getenv("GBEEX_SECRET", "@password@1234567890@@")
ALGORITHM                = "HS256"
ACCESS_TOKEN_EXPIRE_MIN  = 30  # minutes
LOCKOUT_DURATION_MINUTES = 5

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
db     = client[DATABASE_NAME]

# --- Pydantic Models ---
class Token(BaseModel):
    access_token: str
    token_type: str

class UserBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    staffId:     str        # <-- matches your insert script
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
    passwordHash:        str
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
    siteId:                 str
    siteName:               str
    country:                str
    location:               SiteLocation
    sitePerformanceSummary: SitePerformanceSummary

class Notification(BaseModel):
    id:        str
    userId:    str
    title:     str
    message:   str
    type:      str
    icon:      str
    timestamp: datetime
    read:      bool
    link:      Optional[str]
    metadata:  dict

# --- Auth & JWT utilities ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def verify_password(plain_password: str, hashed_password) -> bool:
    if isinstance(hashed_password, str):
        hashed_bytes = hashed_password.encode('utf-8')
    else:
        hashed_bytes = hashed_password
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_bytes)

def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MIN))
    to_encode = {"sub": subject, "exp": int(expire.timestamp())}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    creds_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload  = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise creds_exc
    except JWTError:
        raise creds_exc

    user_doc = await db[USER_COL].find_one({"username": username})
    if not user_doc:
        raise creds_exc

    # If passwordHash stored as bytes, decode it
    ph = user_doc.get("passwordHash")
    if isinstance(ph, (bytes, bytearray)):
        user_doc["passwordHash"] = ph.decode("utf-8")

    try:
        return UserInDB(**user_doc)
    except ValidationError:
        raise creds_exc

# --- Logging Middleware ---
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logging.info(f"{request.method} {request.url}")
    return await call_next(request)

# --- Endpoints ---
@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to GBeeX API"}

@app.get("/health", tags=["Root"])
async def health():
    return {"status": "ok", "time": datetime.utcnow()}

@app.post("/api/v1/auth/login", response_model=Token, tags=["Authentication"])
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_doc = await db[USER_COL].find_one({"username": form_data.username})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    if user_doc.get("lockoutUntil") and user_doc["lockoutUntil"] > datetime.utcnow():
        raise HTTPException(status_code=403, detail="Account locked. Try later.")

    if not verify_password(form_data.password, user_doc["passwordHash"]):
        attempts = user_doc.get("failedLoginAttempts", 0) + 1
        update   = {"$set": {"failedLoginAttempts": attempts}}
        if attempts >= user_doc.get("maxLoginAttempts", 5):
            update["$set"]["lockoutUntil"] = datetime.utcnow() + timedelta(minutes=LOCKOUT_DURATION_MINUTES)
            update["$set"]["failedLoginAttempts"] = 0
        await db[USER_COL].update_one({"username": form_data.username}, update)
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    await db[USER_COL].update_one(
        {"username": form_data.username},
        {"$set": {"failedLoginAttempts": 0, "lockoutUntil": None}}
    )

    access_token = create_access_token(form_data.username)
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/v1/users/me", response_model=UserResponse, tags=["Users"])
async def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    return UserResponse(**current_user.dict())

@app.get("/api/v1/companies", response_model=List[CompanyListItem], tags=["Companies"])
async def list_companies(current_user: UserInDB = Depends(get_current_user)):
    cursor = db[COMPANY_COL].find({}, {"companyId":1, "companyName":1, "_id":0})
    return await cursor.to_list(length=None)

@app.get("/api/v1/companies/{company_id}", tags=["Companies"])
async def get_company(company_id: str, current_user: UserInDB = Depends(get_current_user)):
    comp = await db[COMPANY_COL].find_one({"companyId": company_id}, {"_id":0})
    if not comp:
        raise HTTPException(status_code=404, detail="Company not found")
    return comp

@app.get("/api/v1/companies/{company_id}/protocols", response_model=List[ProtocolListItem], tags=["Protocols"])
async def list_protocols_for_company(company_id: str, current_user: UserInDB = Depends(get_current_user)):
    pipeline = [
        {"$match": {"companyId": company_id}},
        {"$unwind": "$protocols"},
        {"$project": {"_id":0, "protocolId":"$protocols.protocolId", "protocolName":"$protocols.protocolName"}}
    ]
    return await db[COMPANY_COL].aggregate(pipeline).to_list(length=None)

@app.get("/api/v1/protocols/{protocol_id}/sites", response_model=List[SiteDashboardItem], tags=["Sites"])
async def list_sites_for_protocol(protocol_id: str, current_user: UserInDB = Depends(get_current_user)):
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
                "totalTrialsDone":           "$sitePerformance.totalTrialsDone",
                "trialSuccessRate":          "$sitePerformance.trialSuccessRate",
                "totalSubjectsEnrolledCount":"$sitePerformance.totalSubjectsEnrolledCount",
                "subjectSuccessRate":        "$sitePerformance.subjectSuccessRate",
                "enrollmentRatePerTrial":    "$sitePerformance.enrollmentRatePerTrial",
                "dropoutRatePerTrial":       "$sitePerformance.dropoutRatePerTrial"
            }
        }}
    ]
    sites = await db[COMPANY_COL].aggregate(pipeline).to_list(length=None)
    if not sites:
        raise HTTPException(status_code=404, detail="Protocol not found or no sites")
    return sites

@app.get("/api/v1/notifications", response_model=List[Notification], tags=["Notifications"])
async def list_notifications(current_user: UserInDB = Depends(get_current_user)):
    cursor = db[NOTIFICATION_COL].find({"userId": current_user.staffId}, {"_id":0})
    return await cursor.to_list(length=None)

@app.post("/api/v1/notifications/{nid}/read", tags=["Notifications"])
async def mark_notification_read(nid: str, current_user: UserInDB = Depends(get_current_user)):
    res = await db[NOTIFICATION_COL].update_one(
        {"id": nid, "userId": current_user.staffId},
        {"$set": {"read": True}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "ok"}
