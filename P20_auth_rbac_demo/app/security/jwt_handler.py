# app/security/jwt_handler.py
# This file is responsible for the creation and decoding of JWT.

from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from app.config import settings
from app.models.token import TokenData 

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:

    # modify this dictionary by adding the expiration, copied to a new 
    # variable as we might need the original.
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # If expires_delta is not provided, it defaults to 
        # settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)

    # The calculated expire timestamp is added to our to_encode 
    # dictionary under the key "exp". When jwt.decode() processes a token, 
    # it automatically checks this exp claim and raises a JWTError 
    # if the token has expired.
    to_encode.update({"exp": expire})

    # JSON Web Token (JWT) is created and signed. take a set of data, a 
    # secret key, and an algorithm, and then combine them to produce a 
    # compact, cryptographically signed, URL-safe JSON Web Token string.
    encoded_jwt = jwt.encode(
        to_encode, # Dictionary that represents the data you want to embed within the JWT.
        settings.JWT_SECRET_KEY.get_secret_value(),  # secret key used to sign the token
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt

# This function takes a JWT string, decodes it, validates its signature 
# and expiration, and extracts the payload.
def decode_access_token(token: str) -> Optional[TokenData]:
    # can fail for various reasons (invalid signature, expired token etc).
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY.get_secret_value(),
            algorithms=[settings.JWT_ALGORITHM]
        )
        token_data = TokenData(**payload)
        return token_data
    except JWTError:
        return None 