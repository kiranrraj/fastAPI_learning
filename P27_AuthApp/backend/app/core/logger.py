# app/logger.py
import logging
import sys
from pathlib import Path
from logging.handlers import RotatingFileHandler

from colorlog import ColoredFormatter
from pythonjsonlogger import jsonlogger

LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

LOG_FILE = LOG_DIR / "app.log"
MAX_LOG_SIZE = 5 * 1024 * 1024  # 5MB
BACKUP_COUNT = 3

def get_logger(name: str = "auth-app", level: str = "INFO") -> logging.Logger:
    logger = logging.getLogger(name)

    if not logger.handlers:
        logger.setLevel(getattr(logging, level.upper(), logging.INFO))

        # --- Console Handler with Colors ---
        console_handler = logging.StreamHandler(sys.stdout)
        color_formatter = ColoredFormatter(
            "%(log_color)s[%(asctime)s] [%(levelname)s] %(name)s: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
            log_colors={
                "DEBUG": "cyan",
                "INFO": "green",
                "WARNING": "yellow",
                "ERROR": "red",
                "CRITICAL": "bold_red",
            },
        )
        console_handler.setFormatter(color_formatter)
        logger.addHandler(console_handler)

        # --- File Handler with JSON logs ---
        file_handler = RotatingFileHandler(
            LOG_FILE, maxBytes=MAX_LOG_SIZE, backupCount=BACKUP_COUNT
        )
        json_formatter = jsonlogger.JsonFormatter(
            "%(asctime)s %(levelname)s %(name)s %(message)s"
        )
        file_handler.setFormatter(json_formatter)
        logger.addHandler(file_handler)

        logger.propagate = False

    return logger
