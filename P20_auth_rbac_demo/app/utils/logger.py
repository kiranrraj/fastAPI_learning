# app/utils/logger.py
import logging
from logging.handlers import TimedRotatingFileHandler
import os
from app.config import settings

# This function is designed to be called once at the application's startup
# to configure the logging system globally. It sets up log levels,
# file handlers (with rotation), and console handlers.
def setup_logging():
    log_dir = settings.LOG_DIR 
    os.makedirs(log_dir, exist_ok=True)
    log_file_path = os.path.join(log_dir, settings.LOG_FILE_NAME) 

    # Get the root logger
    logger = logging.getLogger()
    logger.setLevel(settings.LOG_LEVEL) 

    # Clear existing handlers to prevent duplicate logs if called multiple times
    if logger.hasHandlers():
        logger.handlers.clear()

    formatter = logging.Formatter(
        fmt="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # File handler for writing logs to a file with rotation
    file_handler = TimedRotatingFileHandler(
        log_file_path,
        when="midnight",
        interval=1,
        backupCount=settings.LOG_BACKUP_COUNT,
        encoding='utf-8'
    )
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    # Console handler for outputting logs to the console
    if settings.LOG_TO_CONSOLE: 
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

    logger.info(f"Logging configured. Logs will be written to: {log_file_path}")

# This function provides a convenient way to get a named logger instance.
# It should be called from any module that needs to perform logging.
def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)