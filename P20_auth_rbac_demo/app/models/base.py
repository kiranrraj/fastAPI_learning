# app/models/base.py
from bson import ObjectId
from pydantic import BaseModel, GetCoreSchemaHandler, GetJsonSchemaHandler
from pydantic_core import CoreSchema, core_schema
from typing import Any, Dict

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

    # NEW for Pydantic V2: This method defines how Pydantic should
    # generate the JSON schema for this custom type (for OpenAPI docs).
    @classmethod
    def __get_pydantic_json_schema__(
        cls, core_schema: CoreSchema, handler: GetJsonSchemaHandler
    ) -> Dict[str, Any]:
        json_schema = handler(core_schema)
        # Here we tell OpenAPI that this custom type should be represented as a string.
        json_schema.update(type="string")
        return json_schema

    # NEW for Pydantic V2: This method defines how Pydantic should
    # handle the validation and serialization of this type internally.
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: GetCoreSchemaHandler
    ) -> CoreSchema:
        # Define that this type can be accepted as a JSON string or a Python ObjectId instance.
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),  # CORRECTED: Changed to core_schema.str_schema()
            python_schema=core_schema.is_instance_schema(ObjectId),
            # Define how to serialize it back to JSON: convert to string.
            serialization=core_schema.to_string_ser_schema(),
        )

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
        # is converted to JSON (e.g., in API responses).
        json_encoders = {ObjectId: str}