from datetime import datetime

def format_to_mmddyyyy_hhmmss(dt: datetime) -> str:
    return dt.strftime("%m/%d/%Y %H:%M:%S")
