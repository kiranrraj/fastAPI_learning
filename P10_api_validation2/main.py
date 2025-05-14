from fastapi import FastAPI, Depends, HTTPException, Header
from typing import Optional
import uvicorn

app = FastAPI()

# === Dependency 1: Basic token verification ===
def verify_token(x_token: str = Header(...)) -> str:
    if x_token != "secure-token":
        raise HTTPException(status_code=403, detail="Unauthorized token")
    return x_token

# === Dependency 2: Extract user role from headers ===
def get_user_role(x_role: Optional[str] = Header(None)) -> str:
    if x_role is None:
        raise HTTPException(status_code=400, detail="Missing user role header")
    return x_role

# === Dependency 3: Require admin role ===
def require_admin(role: str = Depends(get_user_role)):
    if role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return role

# === Public route (no auth) ===
@app.get("/public")
def public_data():
    return {"message": "This is public information"}


# === Authenticated route ===
@app.get("/secure-data")
def secure_data(token: str = Depends(verify_token)):
    return {"message": "Secure data accessed", "token": token}
# x-token	secure-token  // Header
# {"message":"Secure data accessed","token":"secure-token"}
# INFO:     127.0.0.1:51332 - "GET /secure-data HTTP/1.1" 200 OK


# === Role-based access route ===
@app.get("/admin-only")
def admin_panel(token: str = Depends(verify_token), role: str = Depends(require_admin)):
    return {"message": "Welcome admin!", "role": role}
# x-token	secure-token    // Header
# x-role	admin           // Header
# {"message":"Welcome admin!","role":"admin"}
# INFO:     127.0.0.1:51176 - "GET /admin-only HTTP/1.1" 200 OK


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

# FastAPI uses case-insensitive matching for headers but it automatically converts 
# underscores (_) to hyphens (-) because HTTP headers cannot contain underscores.
# def verify_token(x_token: str = Header(..., convert_underscores=False)):

# Use the convert_underscores=False option in Header():
# def verify_token(x_token: str = Header(..., convert_underscores=False)):
# Then FastAPI will expect exactly x_token as the HTTP header name, not x-token.