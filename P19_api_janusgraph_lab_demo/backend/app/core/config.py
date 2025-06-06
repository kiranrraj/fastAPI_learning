from pydantic import BaseModel
from dotenv import load_dotenv
import os

# =========================================
# Load ENV file path from ENV_FILE (set in run.py)
# Defaults to ".env.dev" if ENV_FILE is not set
# =========================================
env_path = os.getenv("ENV_FILE", ".env.dev")
load_dotenv(env_path)

# =========================================
# Settings Model - Loaded from ENV
# =========================================
class Settings(BaseModel):
    # ------------------------
    # Core
    # ------------------------
    env: str = os.getenv("APP_ENV", "development") 
    debug: bool = os.getenv("DEBUG", "true").lower() == "true"

    # ------------------------
    # MongoDB Settings
    # ------------------------
    mongo_host: str = os.getenv("MONGO_HOST", "localhost")
    mongo_port: int = int(os.getenv("MONGO_PORT", 27017))
    mongo_db: str = os.getenv("MONGO_DB", "labapp")
    mongo_user: str = os.getenv("MONGO_USER", "")
    mongo_password: str = os.getenv("MONGO_PASSWORD", "")
    _mongo_uri_override: str = os.getenv("MONGO_URI", "")

    # Dynamically generate URI (for dev: no auth, for prod: with auth)
    @property
    def mongo_uri(self) -> str:
        if self._mongo_uri_override:
            return self._mongo_uri_override
        if self.env == "production":
            return f"mongodb://{self.mongo_user}:{self.mongo_password}@{self.mongo_host}:{self.mongo_port}/?authSource=admin"
        return f"mongodb://{self.mongo_host}:{self.mongo_port}"

    # ------------------------
    # JanusGraph
    # ------------------------
    janusgraph_url: str = os.getenv("JANUSGRAPH_URL", "ws://localhost:8182/gremlin")

    # ------------------------
    # MinIO
    # ------------------------
    minio_endpoint: str = os.getenv("MINIO_ENDPOINT", "localhost:9000")
    minio_access_key: str = os.getenv("MINIO_ACCESS_KEY", "")
    minio_secret_key: str = os.getenv("MINIO_SECRET_KEY", "")
    minio_bucket: str = os.getenv("MINIO_BUCKET", "lab-logs")
    minio_secure: bool = os.getenv("MINIO_SECURE", "false").lower() == "true"

    # ------------------------
    # Logging
    # ------------------------
    log_level: str = os.getenv("LOG_LEVEL", "DEBUG")
    log_file_enabled: bool = os.getenv("LOG_FILE_ENABLED", "true").lower() == "true"
    log_file_name: str = os.getenv("LOG_FILE_NAME", "lab_app.log")
    log_file_max_bytes: int = int(os.getenv("LOG_FILE_MAX_BYTES", 10 * 1024 * 1024))  # 10 MB
    log_file_backup_count: int = int(os.getenv("LOG_FILE_BACKUP_COUNT", 5))
    log_minio_enabled: bool = os.getenv("LOG_MINIO_ENABLED", "false").lower() == "true"
    log_minio_expiry_days: int = int(os.getenv("LOG_MINIO_EXPIRY_DAYS", 30))

    # ------------------------
    # JWT Authentication
    # ------------------------
    secret_key: str = os.getenv("SECRET_KEY", "supersecret")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Singleton-style getter
def get_settings() -> Settings:
    return Settings()
