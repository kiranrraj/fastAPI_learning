# app/logger.py

import logging, os
from app.config import settings
from logging.handlers import TimedRotatingFileHandler

logger = logging.getLogger("labX")

log_dir = os.path.dirname(settings.log_file)
if log_dir:
    os.makedirs(log_dir, exist_ok=True)


if settings.env == "dev":
    log_level = logging.DEBUG
else:
    # logger.setLevel() and handler.setLevel() methods expect an integer.
    log_level = logging.getLevelName(settings.log_level.upper())

logger.setLevel(log_level)

# Create a StreamHandler, which sends logging output to streams like sys.stdout (console).
console_handler = logging.StreamHandler()
# Set the logging level for this specific handler, only show messages at or above this level.
console_handler.setLevel(log_level)

file_handler = TimedRotatingFileHandler(
    filename=settings.log_file,  # The file where logs will be written.
    when="midnight",             # Specifies that the log file should rotate every day at midnight.
    backupCount=7,               # Keeps the last 7 rotated log files as backups.
    encoding="utf-8"             # Specifies the character encoding for the log file.
)

file_handler.setLevel(log_level)

# Python latest version 
formatter = logging.Formatter(
    "%(asctime)s: %(levelname)s: %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)


# This prevents adding handlers multiple times if the logger.py module is 
# imported more than once. If handlers are added multiple times, log messages 
# will be duplicated.
if not logger.hasHandlers():
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)