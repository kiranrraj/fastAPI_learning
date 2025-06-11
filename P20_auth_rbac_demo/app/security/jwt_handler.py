# app/security/jwt_handler.py
# This file is responsible for the creation and decoding of JWT.

from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from app.config import settings
from app.models.token import TokenData
from app.logger import get_logger 

logger = get_logger(__name__)


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
    try: # NEW: Add try-except for JWT encoding errors
        encoded_jwt = jwt.encode(
            to_encode, # Dictionary that represents the data you want to embed within the JWT.
            settings.JWT_SECRET_KEY.get_secret_value(),  # secret key used to sign the token
            algorithm=settings.JWT_ALGORITHM
        )
        logger.info(f"JWT created successfully for user: {data.get('username')}, role: {data.get('role')}")
        return encoded_jwt
    except Exception as e:
        logger.error(f"Failed to create JWT: {e}", exc_info=True)
        # Depending on severity, you might re-raise or handle more gracefully.
        # For now, it will propagate as a 500 error if not caught higher up.
        raise # Re-raise the exception after logging


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
        logger.debug(f"JWT decoded successfully. User: {token_data.username}, Role: {token_data.role}")
        return token_data
    except JWTError as e:
        logger.warning(f"JWT decoding failed (JWTError): {e}. Token may be invalid, expired, or tampered with.")
        return None
    except Exception as e:
        logger.error(f"Unexpected error during JWT decoding: {e}", exc_info=True)
        return None