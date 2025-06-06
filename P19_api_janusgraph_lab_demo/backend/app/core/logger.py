# backend/app/core/logger.py

import os
import sys
from datetime import datetime
from threading import Thread
from loguru import logger
from minio import Minio
from dotenv import load_dotenv

# Load environment (if not already loaded)
load_dotenv()

# Config from .env
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()

# === File Logging ===
LOG_FILE_ENABLED = os.getenv("LOG_FILE_ENABLED", "false").lower() == "true"
LOG_FILE_NAME = os.getenv("LOG_FILE_NAME", "lab_app.log")
LOG_FILE_MAX_BYTES = int(os.getenv("LOG_FILE_MAX_BYTES", 10 * 1024 * 1024))  # Default 10 MB
LOG_FILE_BACKUP_COUNT = int(os.getenv("LOG_FILE_BACKUP_COUNT", 5))

LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE_PATH = os.path.join(LOG_DIR, LOG_FILE_NAME)
ERROR_LOG_PATH = os.path.join(LOG_DIR, "error.log")

# === MinIO Logging ===
LOG_MINIO_ENABLED = os.getenv("LOG_MINIO_ENABLED", "false").lower() == "true"
MINIO_BUCKET = os.getenv("LOG_MINIO_BUCKET", "lab-logs")
MINIO_EXPIRY_DAYS = int(os.getenv("LOG_MINIO_EXPIRY_DAYS", 30))
MINIO_ENDPOINT = os.getenv("LOG_MINIO_ENDPOINT", "")
MINIO_ACCESS_KEY = os.getenv("LOG_MINIO_ACCESS_KEY", "")
MINIO_SECRET_KEY = os.getenv("LOG_MINIO_SECRET_KEY", "")
MINIO_SECURE = os.getenv("LOG_MINIO_SECURE", "false").lower() == "true"

# === MinIO Upload ===
def upload_log_to_minio():
    try:
        client = Minio(
            endpoint=MINIO_ENDPOINT.replace(
                "http://", "").replace("https://", ""),
            access_key=MINIO_ACCESS_KEY,
            secret_key=MINIO_SECRET_KEY,
            secure=MINIO_SECURE,
        )

        if not client.bucket_exists(MINIO_BUCKET):
            client.make_bucket(MINIO_BUCKET)

        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

        # Upload lab_app.log
        main_log_name = f"{LOG_FILE_NAME}_{timestamp}"
        client.fput_object(MINIO_BUCKET, main_log_name, LOG_FILE_PATH)
        logger.info(f"[MinIO] Uploaded main log: {main_log_name}")

        # Upload error.log
        error_log_name = f"error_{timestamp}.log"
        client.fput_object(MINIO_BUCKET, error_log_name, ERROR_LOG_PATH)
        logger.info(f"[MinIO] Uploaded error log: {error_log_name}")

    except Exception as e:
        logger.error(f"[MinIO] Upload failed: {e}")


# === Logger Setup ===
def setup_logging():
    logger.remove()

    # Console logging
    logger.add(sys.stdout, level=LOG_LEVEL,
               format="{time} | {level} | {message}")

    logger.add(
        os.path.join(LOG_DIR, "error.log"),
        level="ERROR",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}",
        rotation="1 week",           # Optional: rotate weekly
        retention="30 days",         # Optional: retain for 30 days
    )

    # File logging
    if LOG_FILE_ENABLED:
        logger.add(
            LOG_FILE_PATH,
            rotation=LOG_FILE_MAX_BYTES,
            retention=LOG_FILE_BACKUP_COUNT,
            level=LOG_LEVEL,
            format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}",
        )

    # Upload to MinIO in background
    if LOG_MINIO_ENABLED:
        Thread(target=upload_log_to_minio, daemon=True).start()
