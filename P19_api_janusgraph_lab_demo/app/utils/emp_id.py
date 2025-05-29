import random
from datetime import datetime
from enum import Enum

def generate_emp_id(role: str, join_date: datetime) -> str:
    """
    Generate an employee ID with format:
    LS + first two letters of role (uppercase) + 6-digit random number + MMYY (join date)
    """
    prefix = "LS"
    role_code = role[:2].upper()
    random_number = f"{random.randint(0, 999999):06d}"
    date_code = join_date.strftime("%m%y")
    return f"{prefix}{role_code}{random_number}{date_code}"
