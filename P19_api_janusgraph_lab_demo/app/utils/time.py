from datetime import datetime, timezone, timedelta

# Define IST timezone as a constant
IST = timezone(timedelta(hours=5, minutes=30))

def format_datetime_to_ist(dt: datetime) -> str:
    """
    Convert a UTC datetime to Indian Standard Time (IST)
    and format it as 'dd/mm/yyyy HH:mm'.
    """
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    # Convert to IST timezone
    ist_dt = dt.astimezone(IST)
    # Format into dd/mm/yyyy hh:mm
    return ist_dt.strftime("%d/%m/%Y %H:%M")
