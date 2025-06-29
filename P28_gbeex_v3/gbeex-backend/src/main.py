# src/main.py

import uvicorn
import time
from fastapi import FastAPI, Request, Response 
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.core.config import config
from src.core.logger import logger
from src.db.mongo import connect_to_mongo, close_mongo_connection, mongo

from src.routes import auth
from src.routes import notification

# Lifespan context for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f" Starting {config.APP_NAME} with lifespan...")
    try:
        await connect_to_mongo()
        if mongo.db_instance is None:
            logger.critical("MongoDB connection reported successful but mongo.db_instance is still None in lifespan.")
            raise RuntimeError("MongoDB connection failed to initialize database instance.")
        logger.info("MongoDB connection confirmed in lifespan context.")
        yield
    finally:
        logger.info(f" Shutting down {config.APP_NAME}...")
        await close_mongo_connection()

# --- FastAPI App Instance ---
app = FastAPI(
    title=config.APP_NAME,
    debug=config.DEBUG,
    lifespan=lifespan
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Custom Request Logging Middleware ---
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Log incoming request details
    logger.info(f"Incoming Request: {request.method} {request.url.path} from {request.client.host}:{request.client.port}")

    try:
        response = await call_next(request)
    except Exception as e:
        # Catch exceptions that occur during processing 
        process_time = time.time() - start_time
        logger.error(f"Request Failed: {request.method} {request.url.path} from {request.client.host} - "
                     f"Error: {e.__class__.__name__} in {process_time:.4f}s", exc_info=True)
        raise # Re-raise the exception to be handled by FastAPI's default handlers/middlewares

    process_time = time.time() - start_time
    response_status = response.status_code

    logger.info(f"Outgoing Response: {request.method} {request.url.path} - "
                f"Status: {response_status} in {process_time:.4f}s")
    
    return response

# --- API Routers ---
# Placeholder for your API routers
# from src.api.v1.routers.auth import router as auth_router
# app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])

# --- Root Route ---
@app.get("/")
async def root():
    logger.debug("Accessing root endpoint.")
    return {"message": f"Welcome to {config.APP_NAME}"}

# --- Health Check Route ---
@app.get("/health")
async def health_check():
    logger.debug("Performing health check.") 
    try:
        if mongo.db_instance is None:
            logger.error("Health check failed: MongoDB client not initialized in health_check.")
            raise ValueError("MongoDB client not initialized.")
        await mongo.db_instance.command("ping")
        logger.debug("MongoDB ping successful.")
        return {"status": "ok", "db": "connected"}
    except Exception as e:
        logger.error(f"Health check failed during ping command: {e}")
        return JSONResponse(status_code=503, content={"status": "fail", "db": "unavailable"})

# --- Spec Route ---
@app.get("/spec")
async def get_spec():
    logger.debug("Request for API specification received.")
    return {
        "app": config.APP_NAME,
        "debug": config.DEBUG,
        "db_uri": config.MONGO_URI,
        "token_expiry": {
            "access_minutes": config.ACCESS_TOKEN_EXPIRE_MINUTES,
            "refresh_minutes": config.REFRESH_TOKEN_EXPIRE_MINUTES,
        }
    }

app.include_router(auth.router)
app.include_router(notification.router)

# --- Uvicorn Server Startup ---
if __name__ == "__main__":
    uvicorn.run(
        "src.main:app",
        host="127.0.0.1",
        port=config.UVICORN_PORT,
        reload=config.DEBUG,
        log_level="info"
    )