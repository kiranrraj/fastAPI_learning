# gbeex-backend/src/core/config.py

from pydantic_settings import BaseSettings, SettingsConfigDict

class AppConfig(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_NAME: str = "GBEEX API"
    DEBUG: bool = True
    MONGO_URI: str
    MONGO_DB_NAME: str
    JWT_SECRET_KEY: str  
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 

config = AppConfig()
