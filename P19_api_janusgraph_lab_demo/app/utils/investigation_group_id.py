from datetime import datetime
import random

def generate_group_id(name: str, created_at: datetime) -> str:
    prefix = "LSGR"
    name_code = (name[:4].upper().ljust(4, "X"))  
    timestamp = created_at.strftime("%m%d%S")    
    return f"{prefix}{name_code}{timestamp}"
