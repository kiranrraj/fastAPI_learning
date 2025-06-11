# app/logger.py
import logging
from logging.handlers import TimedRotatingFileHandler
import os
from app.config import settings

def setup_logging():

    log_dir = settings.LOG_DIR 
    os.makedirs(log_dir, exist_ok=True)
    log_file_path = os.path.join(log_dir, settings.LOG_FILE_NAME) 

    logger = logging.getLogger()
    logger.setLevel(settings.LOG_LEVEL) 

    if logger.hasHandlers():
        logger.handlers.clear()

    formatter = logging.Formatter(
        fmt="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    file_handler = TimedRotatingFileHandler(
        log_file_path,
        when="midnight",
        interval=1,
        backupCount=settings.LOG_BACKUP_COUNT,
        encoding='utf-8'
    )

    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    if settings.LOG_TO_CONSOLE: 
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

    logger.info(f"Logging configured. Logs will be written to: {log_file_path}")

def get_logger(name: str):
    return logging.getLogger(name)