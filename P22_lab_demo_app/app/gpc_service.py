# Gremlin Python client is not truly async.
# Solution: Run Gremlin in a separate thread
# Use asyncio.to_thread() to run blocking code (Gremlin) 
# in a background thread, and let FastAPI stay async

from app.gremlin_client import get_gremlin_client
import asyncio

def _fetch_vertices():
    """Fetch all vertices using Gremlin query."""
    g = get_gremlin_client()
    result_set = g.submit("g.V().elementMap()")
    return [r for r in result_set]  # list of dicts

def _group_vertices_by_label():
    """Group vertex count by label."""
    g = get_gremlin_client()
    result_set = g.submit("g.V().groupCount().by(label)")
    return result_set.one()  # returns a dict

# # Run this sync code in a thread to avoid blocking FastAPI's event loop
async def get_all_vertices():
    return await asyncio.to_thread(_fetch_vertices)

async def count_vertices_by_label():
    return await asyncio.to_thread(_group_vertices_by_label)