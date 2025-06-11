# /app/config.py

from typing import List, Literal # Ensure Literal is imported
from pydantic import Field, AnyUrl, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
import logging # Import logging to use its levels

class AppSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="APP_", 
        case_sensitive=False,
        extra="ignore",
    )

    APP_NAME: str = "FastAPI Auth Demo"
    APP_ENV: Literal["development", "testing", "production"] = "development"
    DEBUG: bool = True

    # MongoDB Settings
    MONGO_DB_URL: str = Field("mongodb://localhost:27017", env="MONGO_DB_URL")
    MONGO_DB_NAME: str = Field("fastapi_testing", env="MONGO_DB_NAME")

    # JWT Authentication Settings
    JWT_SECRET_KEY: SecretStr = Field(SecretStr("DeveloperKey"), env="JWT_SECRET_KEY")
    JWT_ALGORITHM: str = Field("HS256", env="JWT_ALGORITHM")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(30, env="JWT_ACCESS_TOKEN_EXPIRE_MINUTES")

    # CORS Settings
    CORS_ORIGINS: List[str] = Field(["*"], env="CORS_ORIGINS")
    CORS_METHODS: List[str] = Field(["*"], env="CORS_METHODS")
    CORS_HEADERS: List[str] = Field(["*"], env="CORS_HEADERS")

    # Role based collection names
    ADMIN_COLLECTION: str = Field("admin_data", env="ADMIN_COLLECTION")
    DOCTOR_COLLECTION: str = Field("doctor_data", env="DOCTOR_COLLECTION")
    TESTCENTER_COLLECTION: str = Field("testcenter_data", env="TESTCENTER_COLLECTION")

    # Logging Settings
    LOG_DIR: str = Field("logs", env="LOG_DIR")
    LOG_FILE_NAME: str = Field("api.log", env="LOG_FILE_NAME")
    LOG_LEVEL: str = Field(logging.INFO, env="LOG_LEVEL") 
    LOG_BACKUP_COUNT: int = Field(7, env="LOG_BACKUP_COUNT") 
    LOG_TO_CONSOLE: bool = Field(True, env="LOG_TO_CONSOLE")

settings = AppSettings()

# Warning if using default secret key in development
if settings.JWT_SECRET_KEY.get_secret_value() == "DeveloperKey" and settings.APP_ENV == "development":
    print("WARNING: Using default JWT_SECRET_KEY. Please change this in your .env file for production.")
    print(f"Current environment is {settings.APP_ENV}!")