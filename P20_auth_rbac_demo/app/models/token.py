# app/models/token.py
from typing import Optional
from app.models.base import AppBaseModel

# The Token model defines the structure of the response sent to the 
# client upon successful user login. This response will contain the 
# JSON Web Token (JWT) that the client needs to include in subsequent 
# authenticated requests.
class Token(AppBaseModel):
    access_token: str
    token_type: str = "bearer" # Standard token type

# Represents the payload of your JSON Web Token. This is the structured 
# information that you embed within the JWT when you create it, and then 
# extract and validate when you receive an authenticated request.
class TokenData(AppBaseModel):
    username: Optional[str] = None
    role: Optional[str] = None 