from enum import Enum

class Gender(str, Enum):
    """
    Allowed values for patient gender.
    Inherits from str so JSON serializes as string.
    """
    male = "male"
    female = "female"
    other = "other"
    not_given = "not_given"

class StaffRole(str, Enum):
    """
    Allowed staff roles in the system.
    """
    doctor = "doctor"
    nurse = "nurse"
    technician = "technician"
    admin = "admin"
    other = "other"
