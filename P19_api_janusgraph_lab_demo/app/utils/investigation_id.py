from datetime import datetime

def generate_investigation_id(test_name: str, created_at: datetime) -> str:
    """
    Generate an investigation ID of format:
    LS + 4-letter padded test name + DDMMYY + SS
    """
    name_part = test_name.strip().upper()[:4].ljust(4, "0")  # Pad to 4 characters
    date_part = created_at.strftime("%d%m%y")  # e.g., 250524
    seconds_part = created_at.strftime("%S")   # Seconds from datetime
    return f"LS{name_part}{date_part}{seconds_part}"
