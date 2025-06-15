# app/config.py

import os
from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class AppSettings(BaseSettings):
    """
    Base settings for LabX application.  
    Reads from environment (or .env).
    """
    # 'env' variable: Specifies the current operating environment
    # Set to local if ENV environment variable is not set
    env: str = "local"
    gremlin_url: str
    log_level: str = "INFO"
    log_file: str = "labx_app_dev_debug.log"

    model_config = ConfigDict(
        # Instructs Pydantic to load environment variables from a file named ".env".
        env_file=".env",
        # Specifies the encoding for the .env file.
        env_file_encoding="utf-8",
        # All environment variables for this app must start with "LABX_"
        env_prefix="LABX_",
        # If there are environment variables or .env entries not defined in this class,
        # Pydantic will ignore them instead of raising an error.
        extra="ignore"
    )

class AppProdSettings(AppSettings):
    """Production settings can override defaults or add prod-only values."""
    env: str = "prod"               # Sets the environment to "prod".
    log_level: str = "INFO"
    log_file_name: str = "labx_app_prod.log"

class AppDevSettings(AppSettings):
    """Development settings can override defaults or add dev-only values."""
    env: str = "dev"                # Explicitly sets the environment to "dev".
    log_level: str = "DEBUG"
    log_file_name: str = "labx_app_dev.log"

# Get the value of the "ENV" environment variable.
# Default to "local" if the ENV variable is not set or is empty.
_env = os.getenv("ENV", "local").strip().lower()

if _env  == "prod":
    settings = AppProdSettings()
elif _env  == "dev":
    settings = AppDevSettings()
else:
    settings = AppSettings()
