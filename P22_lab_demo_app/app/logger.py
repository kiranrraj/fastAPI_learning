# app/logger.py

import logging, os
from app.config import settings
from logging.handlers import TimedRotatingFileHandler

logger = logging.getLogger("labX")

os.makedirs(os.path.dirname(settings.log_file), exist_ok=True)

if settings.env == "dev":
    log_level = logging.DEBUG
else:
    # logger.setLevel() and handler.setLevel() methods expect an integer.
    log_level = logging.getLevelName(settings.log_level.upper())

logger.setLevel(log_level)

console_handler = logging.StreamHandler()
console_handler.setLevel(log_level)

file_handler = logging.TimedRotatingFileHandler(
    filename=settings.log_file,
    when="midnight",
    backupCount=7, 
    mode="a", 
    encoding="utf-8"
)

file_handler.setLevel(log_level)

formatter = logging.Formatter(
    format="%(asctime)s: %(levelname)s: %(name)s: %(message)s", 
    datefmt="%Y-%m-%d %H:%M:%S",
)

console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

if not logger.hasHandlers():
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)