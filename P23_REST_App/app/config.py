# labx_app/config.py

from pydantic import Field
from pydantic_settings import BaseSettings
from typing import Literal

class AppConfig(BaseSettings):
    janus_uri: str = Field("ws://localhost:8182/gremlin", alias="JANUS_URI")
    debug: bool = Field(True, alias="DEBUG")
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = Field("INFO", alias="LOG_LEVEL")
    retry_count: int = Field(3, alias="RETRY_COUNT")
    timeout: int = Field(10, alias="TIMEOUT")

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

config = AppConfig()
