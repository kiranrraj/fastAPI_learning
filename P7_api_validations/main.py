from fastapi import FastAPI
from typing import Annotated
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Union
from enum import Enum

app = FastAPI()

# -----------------------------------------------------
# 1. Basic Request Body Validation
# Accepts a user with a required username and age
class User(BaseModel):
    username: str
    age: int

@app.post("/user/")
def create_user(user: User):
    return {"message": f"User {user.username} is {user.age} years old"}


# -----------------------------------------------------
# 2. Optional Field with Default Value
# Email is optional and defaults to None if not provided
class OptionalUser(BaseModel):
    username: str
    email: Optional[str] = None

@app.post("/optional/")
def register_user(user: OptionalUser):
    return {"username": user.username, "email": user.email}


# -----------------------------------------------------
# 3. Field Validation Using Field()
# Name must be 3–50 characters long; price must be > 0
class Product(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    price: float = Field(..., gt=0)

@app.post("/product/")
def add_product(product: Product):
    return product


# -----------------------------------------------------
# 4. Nested Models
# Customer model includes an embedded Address model
class Address(BaseModel):
    city: str
    zip_code: str

class Customer(BaseModel):
    name: str
    address: Address

@app.post("/customer/")
def create_customer(customer: Customer):
    return {
        "name": customer.name,
        "city": customer.address.city,
        "zip_code": customer.address.zip_code
    }


# -----------------------------------------------------
# 5. List of Nested Models
# Order has a list of items; each item has a name and quantity
class Item(BaseModel):
    name: str
    quantity: int

class Order(BaseModel):
    order_id: str
    items: List[Item]

@app.post("/order/")
def create_order(order: Order):
    return {
        "order_id": order.order_id,
        "total_items": len(order.items),
        "items": order.items
    }


# -----------------------------------------------------
# 6. Using Enums for Choices
# Status must be one of the Enum values
class Status(str, Enum):
    pending = "pending"
    shipped = "shipped"
    delivered = "delivered"

class OrderStatus(BaseModel):
    order_id: str
    status: Status

@app.post("/status/")
def update_status(order: OrderStatus):
    return {"order": order.order_id, "new_status": order.status}


# -----------------------------------------------------
# 7. Default Factory with List
# If no tags are provided, default to ["general"]
def default_tags():
    return ["general"]

class Blog(BaseModel):
    title: str
    tags: List[str] = Field(default_factory=default_tags)

@app.post("/blog/")
def create_blog(blog: Blog):
    return blog


# -----------------------------------------------------
# 8. Constrained Types with conint
# Rating must be an integer between 1 and 5 (inclusive)
class Vote(BaseModel):
    rating: Annotated[int, Field(ge=1, le=5)]

@app.post("/vote/")
def cast_vote(vote: Vote):
    return {"rating": vote.rating}


# -----------------------------------------------------
# 9. Union Types for Flexible Input
# Input can either be a Dog or a Cat model
class Dog(BaseModel):
    breed: str

class Cat(BaseModel):
    color: str

@app.post("/pet/")
def add_pet(pet: Union[Dog, Cat]):
    return pet


# -----------------------------------------------------
# 10. Custom Validator for Business Logic
# Ensure the name starts with a capital letter
class Person(BaseModel):
    name: str
    age: int

    @field_validator('name')
    def name_must_be_capitalized(cls, v):
        if not v[0].isupper():
            raise ValueError('Name must start with a capital letter')
        return v

@app.post("/person/")
def create_person(person: Person):
    return person
