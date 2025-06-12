# app\config.py

from pydantic_settings import BaseSettings, SettingsConfigDict

class AppSettings(BaseSettings):
    app_name: str = "JanusAPI"
    gremlin_url: str = "ws://localhost:8182/gremlin"
    gremlin_source: str = "g"
    cors_origins: list[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="APP_"
    )

settings = AppSettings()
