# app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from app.core.logger import get_logger
import sys

logger = get_logger("config")

class Settings(BaseSettings):
    MONGO_SERVER: str
    MONGO_DATABASE: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

# Load settings with error handling
try:
    settings = Settings()
    logger.info("Environment variables loaded successfully.")
except Exception as e:
    logger.critical(f"Failed to load environment variables: {e}")
    sys.exit(1)
