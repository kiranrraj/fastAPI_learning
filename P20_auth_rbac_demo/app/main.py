# main.py

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.utils.logger import setup_logging, get_logger

from app.routes.data.admin_data import router as admin_router
from app.routes.data.doctor_data import router as doctor_router
from app.routes.data.testcenter_data import router as testcenter_router

# Get a logger instance for the main application file
logger = get_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan context manager for application startup and shutdown events.
    Ensures that logging is set up and database connections are managed.
    """
    # Startup events
    setup_logging()
    logger.info(f"Application '{settings.APP_NAME}' starting up...")
    logger.debug(f"Environment: {settings.APP_ENV}, Debug Mode: {settings.DEBUG}")

    await connect_to_mongo()
    logger.info("Database connection established.")

    yield # The application runs during this yield

    # Shutdown events
    await close_mongo_connection()
    logger.info("Database connection closed.")
    logger.info(f"Application '{settings.APP_NAME}' shutting down.")


# Initialize FastAPI application with the lifespan manager
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="A secure FastAPI application with JWT authentication and role-based access control.",
    docs_url="/docs" if settings.DEBUG else None,  # Enable docs only in debug mode
    redoc_url="/redoc" if settings.DEBUG else None, # Enable redoc only in debug mode
    lifespan=lifespan # Assign the lifespan context manager
)

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows your frontend (e.g., React app running on localhost:3000) to
# make requests to your FastAPI backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS, # List of allowed origins (e.g., ["http://localhost:3000"])
    allow_credentials=True, # Allow cookies to be included in cross-origin HTTP requests
    allow_methods=settings.CORS_METHODS,   # Allow specific HTTP methods (e.g., ["*"])
    allow_headers=settings.CORS_HEADERS,   # Allow specific HTTP headers (e.g., ["*"])
)

# Include your API routers
# The 'auth' router handles user authentication (login, registration).
# The 'data' router handles role-based data access.
# app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
# app.include_router(data.router, prefix="/data", tags=["Role-Based Data"])

@app.get("/")
async def root():
    """
    Root endpoint to verify the application is running.
    """
    logger.info("Root endpoint accessed.")
    return {"message": "FastAPI Auth Demo API is running!"}

# Example of a protected endpoint for general users (optional, if you need one)
# @app.get("/protected-general", response_model=dict, tags=["Protected"])
# async def protected_general(current_user: dict = Depends(auth.get_current_user)):
#     """
#     Example protected endpoint accessible by any authenticated user.
#     """
#     logger.info(f"General protected endpoint accessed by user: {current_user['username']} with role: {current_user['role']}")
#     return {"message": f"Welcome, {current_user['username']}! You have general access."}

app.include_router(admin_router, prefix="/admin/data", tags=["Admin Data"])
app.include_router(doctor_router, prefix="/doctor/data", tags=["Doctor Data"])
app.include_router(testcenter_router, prefix="/testcenter/data", tags=["TestCenter Data"])

@app.get("/", tags=["Root"])
async def root():
    logger.info("Health check at /")
    return {"message": f"{settings.APP_NAME} is up and running"}