# config.py
import os
from datetime import timedelta

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "GBeeXDataV4")

# Collection Names
USER_COL = "users"
COMPANY_COL = "clientData"
NOTIFICATION_COL = "notifications"
PORTLET_COL = "portlets"

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "Strong@@password@1234567890@@")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MIN = 30  
REFRESH_TOKEN_EXPIRE_MIN = 7 * 24 * 60 #7 days

LOCKOUT_DURATION_MINUTES = 5