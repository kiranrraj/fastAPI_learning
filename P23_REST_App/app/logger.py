# labx_app/logger.py

import logging
from app.config import config  # Adjust the import path if needed

def get_logger(name: str = "labx") -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.hasHandlers():
        handler = logging.StreamHandler()
        formatter = logging.Formatter("[%(asctime)s] [%(levelname)s] %(message)s")
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(config.log_level.upper())  # Updated for Pydantic v2 field
    return logger
