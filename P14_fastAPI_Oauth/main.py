from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestFormStrict
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
import uvicorn

app = FastAPI()

# Define the token URL for OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# JWT configuration
SECRET_KEY = "super-secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Simulated user authentication function
async def fake_authenticate_user(username: str, password: str):
    print("\n--- Step 1: Authenticating user ---")
    print(f"Received username: {username}")
    print(f"Received password: {password}")
    if username == "testuser" and password == "password":
        print("User credentials are valid.")
        return {"sub": username}
    print("Invalid username or password.")
    return None

# Function to create JWT access tokens
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    print("\n--- Step 2: Creating JWT token ---")
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        human_readable = expire.strftime("%Y-%m-%d %H:%M:%S")
    print(f"Token will expire at: {human_readable}")
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    print(f"Generated JWT: {encoded_jwt}")
    return encoded_jwt

# Function to decode JWT token and get current user
async def get_current_user(token: str = Depends(oauth2_scheme)):
    print("\n--- Step 3: Decoding and validating token ---")
    print(f"Received token: {token}")
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"Decoded payload: {payload}")
        username: str = payload.get("sub")
        if username is None:
            print("Token does not contain username.")
            raise credentials_exception
        print(f"Token is valid for user: {username}")
        return {"username": username}
    except JWTError as e:
        print(f"Token validation failed: {e}")
        raise credentials_exception

# Endpoint for login and token generation
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestFormStrict = Depends()):
    print("\n=== LOGIN REQUEST ===")
    user = await fake_authenticate_user(form_data.username, form_data.password)
    if not user:
        print("Login failed. Raising HTTPException.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user["sub"]}, expires_delta=access_token_expires)
    print("Login successful. Returning token.")
    return {"access_token": access_token, "token_type": "bearer"}

# Protected route that requires a valid JWT
@app.get("/users/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    print("\n=== PROTECTED ROUTE: /users/me ===")
    print(f"Authenticated user: {current_user}")
    return current_user

# Run server
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)