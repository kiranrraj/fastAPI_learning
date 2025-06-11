# app/models/base.py
from bson import ObjectId
from pydantic import BaseModel
from typing import Any 

# MongoDB uses a special 12-byte ObjectId type for its document 
# _id field. Pydantic, by default, doesn't know how to validate 
# or serialize this custom MongoDB type. PyObjectId acts as a 
# custom Pydantic type that correctly handles these ObjectId.
class PyObjectId(ObjectId):

    # This tells Pydantic that whenever it encounters PyObjectId as 
    # a type hint in a model, it should use the validate method defined 
    # within PyObjectId to perform validation.
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    # It checks if the input v is a valid ObjectId using 
    # ObjectId.is_valid(v). If valid, it converts v into a proper 
    # ObjectId instance.
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    # This method is used by Pydantic to tell FastAPI how this custom 
    # type should appear in the auto-generated OpenAPI
    @classmethod
    def __modify_schema__(cls, field_schema: dict[str, Any]): 
        field_schema.update(type="string")

# AppBaseModel serves as a common base class for all other Pydantic 
# models in our application. Its purpose is to centralize and apply 
# a set of common configuration settings to all models that inherit 
# from it, promoting consistency and reducing redundancy.
class AppBaseModel(BaseModel):
    class Config:
        # when a MongoDB document with _id comes in, Pydantic can 
        # correctly map it to the id field in our Python models 
        # if we've used Field(alias="_id").
        populate_by_name = True
        # allows Pydantic to accept and process instances of PyObjectId.
        arbitrary_types_allowed = True
        # Tells Pydantic how to serialize specific types into JSON.
        # It explicitly instructs Pydantic to convert any ObjectId 
        # instances into their string representation when the model 
        # is converted to JSON
        json_encoders = {ObjectId: str}