# backend/app/db/minio.py

from minio import Minio
from app.core.config import get_settings
from loguru import logger

settings = get_settings()
minio_client: Minio | None = None

def init_minio():
    global minio_client
    try:
        minio_client = Minio(
            endpoint=settings.minio_endpoint.replace("http://", "").replace("https://", ""),
            access_key=settings.minio_access_key,
            secret_key=settings.minio_secret_key,
            secure=settings.minio_secure
        )
        logger.info("[MinIO] Client initialized.")
    except Exception as e:
        logger.error(f"[MinIO] Initialization failed: {e}")
        minio_client = None

def get_minio_client():
    if not minio_client:
        raise RuntimeError("MinIO client not initialized")
    return minio_client

def minio_status() -> dict:
    try:
        if not minio_client.bucket_exists(settings.minio_bucket):
            return {"status": "warning", "detail": "Bucket not found"}
        return {"status": "ok", "bucket": settings.minio_bucket}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
