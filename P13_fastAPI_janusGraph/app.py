import sys
import asyncio
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from gremlin_python.driver import client, serializer

# Force the selector event loop on Windows
if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

app = FastAPI(title="JanusGraph API")

# Initialize the Gremlin client once at startup
@app.on_event("startup")
def startup_event():
    app.state.gremlin = client.Client(
        'ws://localhost:8182/gremlin',
        'g',
        message_serializer=serializer.GraphSONSerializersV2d0()
    )

# Clean up on shutdown
@app.on_event("shutdown")
def shutdown_event():
    app.state.gremlin.close()

class Person(BaseModel):
    name: str
    age: int

@app.post("/person/")
def create_person(person: Person):
    query = (
        f"g.addV('person')"
        f".property('name','{person.name}')"
        f".property('age',{person.age})"
        f".next()"
    )
    try:
        result = app.state.gremlin.submit(query).all().result()
        # result is a list of Vertex objects
        v = result[0]
        return {"id": v.id, "label": v.label, "properties": v.properties}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/persons/")
def list_persons(limit: int = 10):
    query = f"g.V().hasLabel('person').limit({limit}).valueMap(true)"
    try:
        result = app.state.gremlin.submit(query).all().result()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
