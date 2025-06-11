# main.py (Improved Version)
from fastapi import FastAPI, HTTPException
from enum import Enum
import uvicorn
from typing import Dict, Any, List

app = FastAPI(
    title="User Role API",
    description="A simple API to get user details based on predefined roles.",
    version="1.0.0"
)

# Define the Enum 
class UserRole(str, Enum): 
    ADMIN = "Administrator"
    DOCTOR = "Medical Practitioner"
    TEST_CENTER = "Diagnostic Center Staff"

    # You can add a method to the enum for convenience
    @property
    def detail_response(self) -> Dict[str, str]:
        return {"role_name": self.name.lower(), "role_description": self.value}


@app.get("/user/{role_name}", response_model=Dict[str, Any])
async def get_user_details(role_name: UserRole):
    # FastAPI automatically validates 'role_name' against UserRole.
    # If the provided role_name is not a valid enum member, FastAPI will
    # automatically return a 422 Unprocessable Entity error before this function is called.
    return role_name.detail_response 

@app.get("/roles", response_model=Dict[str, List[Dict[str, str]]])
async def list_available_roles():
    roles_list = [role.detail_response for role in UserRole]
    return {"available_roles": roles_list}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8010, reload=True)