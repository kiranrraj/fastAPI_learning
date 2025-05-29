# app/utils/branch_code.py
from typing import ClassVar
import threading

class BranchCodeGenerator:
    """
    Thread-safe branch code generator that auto-increments
    and formats the code as: 4-letter location (padded) + 4-digit number
    """
    _lock: ClassVar[threading.Lock] = threading.Lock()
    _counter: ClassVar[int] = 1000

    @classmethod
    def generate_branch_code(cls, location: str) -> str:
        with cls._lock:
            cls._counter += 1
            loc_code = location.upper().strip().replace(" ", "")[:4].ljust(4, 'X')
            return f"{loc_code}{cls._counter}"
