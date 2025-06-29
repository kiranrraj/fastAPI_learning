import logging
from logging.handlers import RotatingFileHandler
import os

LOG_FILE = "gbeex.log"
LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)

LOG_PATH = os.path.join(LOG_DIR, LOG_FILE)

# Formatter for log messages
formatter = logging.Formatter(
    fmt="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

# Create rotating file handler
file_handler = RotatingFileHandler(
    LOG_PATH, maxBytes=5_000_000, backupCount=5, encoding="utf-8"
)
file_handler.setFormatter(formatter)

# Create stream handler for console
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)

# Set up the root logger
logger = logging.getLogger("gbeex")
logger.setLevel(logging.DEBUG)
logger.addHandler(file_handler)
logger.addHandler(stream_handler)
logger.propagate = False 
