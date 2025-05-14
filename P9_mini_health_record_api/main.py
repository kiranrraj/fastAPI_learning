from fastapi import FastAPI, HTTPException, Query, Path, Header, UploadFile, File, Form, Depends
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from enum import Enum
import uvicorn

app = FastAPI()

class User(BaseModel):
    username: str
    password: str
    email: EmailStr

    @field_validator("username")
    def validate_username(cls, usr):
        if len(usr) < 3:
            raise ValueError("Usernname must be at least 3 characters.")
        return usr
    
    @field_validator("password")
    def validate_password(cls, pswd):
        if len(pswd) < 6:
            raise ValueError("Password should be at least 8 characters.")

@app.post("/register/")
def register_user(user: User):
    return {"message": f"User {user.username} created successfully."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)


# # Input data
# {
#   "username": "testuser",
#   "password": "testpassword",
#   "email": "kiran@gmail.com"
# }

# # Output data
# {
# 	"message": "User testuser created successfully."
# }