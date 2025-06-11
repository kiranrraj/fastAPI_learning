# /app/config.py

from typing import List, Literal
from pydantic import Field, AnyUrl, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class AppSettings(BaseSettings): 
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="APP_",
        case_sensitive=False,
        extra="ignore",
    )

    # Core Application Info
    APP_NAME: str = "FastAPI Auth Demo"
    APP_ENV: str = Literal["development", "testing", "production"] = "development"
    DEBUG bool: True

    # MongoDB Settings
    MONGO_DB_URL: str = "mongodb://localhost:27017"
    MONGO_DB_NAME: str = "fastapi_testing"

    # JWT Authentication Settings
    JWT_SECRET_KEY: SecretStr = SecretStr("DeveloperKey")
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS Settings
    CORS_ORIGINS: List[str] = ["*"]
    CORS_METHODS: List[str] = ["*"] 
    CORS_HEADERS: List[str] = ["*"]

    # Role based collection names 
    ADMIN_COLLECTION: str = "admin_data"
    DOCTOR_COLLECTION: str = "doctor_data"
    TESTCENTER_COLLECTION: str = "test_center_data"

settings = AppSettings()

if settings.JWT_SECRET_KEY.get_secret_value() == "DeveloperKey" and settings.APP_ENV == "development":
    print("WARNING: Using default JWT_SECRET_KEY.")
    print(f"Current environment is {settings.APP_ENV}!")



