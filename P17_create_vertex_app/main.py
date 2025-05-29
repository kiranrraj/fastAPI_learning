from fastapi import FastAPI
from gremlin_python import client
from typing import Dict, Any
import uvicorn

app = FastAPI()
GREMLIN_SERVER_URL = "ws://localhost:8182/gremlin"

async def get_gremlin_client():
    try:
        gremlin_client = client.Client(GREMLIN_SERVER_URL, 'g')
        return gremlin_client
    except Exception as e:
        print(f"Error connecting to Gremlin Server: {e}")
        return None

async def close_gremlin_client(gremlin_client: client.Client):
    if gremlin_client:
        await gremlin_client.close()

@app.post("/vertices/")
async def create_vertex(label: str, properties: Dict[str, Any]):
    """Creates a new vertex with the given label and properties."""
    gremlin = await get_gremlin_client()
    if not gremlin:
        return {"error": "Failed to connect to Gremlin Server"}
    try:
        query = f"g.addV('{label}')"
        for key, value in properties.items():
            query += f".property('{key}', '{value}')"
        await gremlin.submit(query)
        return {"message": f"Vertex with label '{label}' created."}
    except Exception as e:
        return {"error": f"Error creating vertex: {e}"}
    finally:
        await close_gremlin_client(gremlin)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)