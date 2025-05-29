import logging
from logging.handlers import RotatingFileHandler
import sys
import os
from datetime import datetime

# Custom rotating file handler that renames rotated logs with a timestamp suffix
class TimestampedRotatingFileHandler(RotatingFileHandler):
    def doRollover(self):
        """
        Override the default rollover behavior to rename the old log file with timestamp suffix.
        """
        # Close the current log file stream if open
        if self.stream:
            self.stream.close()
            self.stream = None

        # Create timestamp string in 'YYYY-MM-DD_HH-MM-SS' format
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

        # New rollover filename with timestamp suffix
        rollover_filename = f"{self.baseFilename}_{timestamp}.log"

        # Rename the current log file to the timestamped filename if it exists
        if os.path.exists(self.baseFilename):
            os.rename(self.baseFilename, rollover_filename)

        # If backupCount > 0, delete old rotated log files exceeding this limit
        if self.backupCount > 0:
            log_dir = os.path.dirname(self.baseFilename) or "."
            base_name = os.path.basename(self.baseFilename)

            # Find all rotated log files matching the pattern baseFilename_*.log
            files = [f for f in os.listdir(log_dir)
                     if f.startswith(base_name + "_") and f.endswith(".log")]

            # Sort files by modification time descending
            files.sort(key=lambda f: os.path.getmtime(os.path.join(log_dir, f)), reverse=True)

            # Remove files exceeding backupCount
            for old_file in files[self.backupCount:]:
                os.remove(os.path.join(log_dir, old_file))

        # Re-open a new log file in append mode for continued logging
        self.mode = 'a'
        self.stream = self._open()


# Create or get a logger instance named 'lab_app'
logger = logging.getLogger("lab_app")

# Set logger to capture all messages from DEBUG level and above
logger.setLevel(logging.DEBUG)

# Define a consistent log message format including timestamp, logger name, level and message
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Console handler: logs messages to standard output 
# Apply the formatter to console logs
# Console logs only INFO and above
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(formatter)
console_handler.setLevel(logging.INFO)

# File handler: uses our custom TimestampedRotatingFileHandler for log rotation by size
file_handler = TimestampedRotatingFileHandler(
    "lab_app.log",           # Base log filename
    maxBytes=10*1024*1024,   # Max size 10 MB before rotating
    backupCount=5            # Keep only 5 rotated log files
)

# Apply the formatter to file logs
# File logs DEBUG and above for detailed info
file_handler.setFormatter(formatter)
file_handler.setLevel(logging.DEBUG)

# Function to attach handlers
def setup_logging():
    if not logger.handlers:
        logger.addHandler(console_handler)
        logger.addHandler(file_handler)
