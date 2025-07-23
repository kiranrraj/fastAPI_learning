# main.py
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

# Import configuration
import config

# Import database client (for global access if needed, though typically via Depends)
from database import db

# Import routers
from routers import auth, companies, notifications, portlets, subjects # Import new subjects router

# --- FastAPI App Initialization ---
app = FastAPI(title="GBeeX API", version="1.0.0")

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Logging Middleware ---
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logging.info(f"{request.method} {request.url}")
    return await call_next(request)

# --- Root & Health Endpoints ---
@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to GBeeX API"}

@app.get("/health", tags=["Root"])
async def health():
    from datetime import datetime, timezone # Import here to avoid top-level issues if not needed elsewhere
    return {"status": "ok", "time": datetime.now(timezone.utc)}

# --- Include Routers ---
app.include_router(auth.router)
app.include_router(companies.router)
app.include_router(notifications.router)
app.include_router(portlets.router)
app.include_router(subjects.router) # Include the new subjects router