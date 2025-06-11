# app/security/hasher.py
from passlib.context import CryptContext

# Creates an instance of CryptContext, use the bcrypt hashing algorithm.
# Tells passlib how to handle older, less secure hashing schemes if your 
# application ever encountered them, "auto" generally means it will warn 
# you about deprecated schemes but still process them if necessary.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Function takes the plain_password and hashes it using the same 
# algorithm and salt that were used to create the hashed_password. It 
# then compares the newly generated hash with the hashed_password 
# provided. It returns True if they match,
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# hash() method of CryptContext to generate a secure hash of the password.
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)