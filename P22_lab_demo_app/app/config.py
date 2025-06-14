# app/config.py

import os
from pydantic import BaseSettings, ConfigDict

class AppSettings(BaseSettings):
    """
    Base settings for LabX application.  
    Reads from environment (or .env).
    """
    gremlin_url: str
    log_level: str = "INFO"
    log_file: str = "labx_app_dev_debug.log"

    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="LABX_",
        extra="ignore"
    )

class AppProdSettings(AppSettings):
    """Production settings can override defaults or add prod-only values."""
    pass

class AppDevSettings(AppSettings):
    """Development settings can override defaults or add dev-only values."""
    pass

_env = os.getenv("ENV", "").strip().lower()

if _env  == "prod":
    settings = AppProdSettings()
elif _env  == "dev":
    settings = AppDevSettings()
else:
    settings = AppSettings()
