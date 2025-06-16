# Gremlin Python client is not truly async.
# Solution: Run Gremlin in a separate thread
# Use asyncio.to_thread() to run blocking code (Gremlin) 
# in a background thread, and let FastAPI stay async

from app.gremlin_client import get_gremlin_client
import asyncio

def _fetch_vertices(skip: int = 0, limit: int = 10):
    """Fetch vertices with pagination using Gremlin query."""
    g = get_gremlin_client()
    gremlin_query = f"g.V().range({skip}, {skip + limit}).elementMap()"
    result_set = g.submit(gremlin_query)
    return [r for r in result_set]

def _fetch_vertex_schema():
    g = get_gremlin_client()
    result_set = g.submit(
        "g.V().group().by(label).by(project('keys').by(properties().key().dedup().fold()))"
    )
    results = result_set.all().result()
    return results[0] if results else {}

def _group_vertices_by_label():
    """Group vertex count by label."""
    g = get_gremlin_client()
    result_set = g.submit("g.V().groupCount().by(label)")
    return result_set.one()  # returns a dict

def _run_spec_query(entity_name: str) -> dict:
    """Blocking Gremlin logic to fetch entity + attributes."""
    g = get_gremlin_client()
    try:
        result_set = g.submit(
            f"""
            g.V().hasLabel('LabXEntity').has('name', '{entity_name}')
            .as('e')
            .out('labx_attr_entity')
            .as('a')
            .project('name', 'desc', 'mandatory', 'type')
                .by(values('name'))
                .by(values('desc'))
                .by(values('mandatory'))
                .by(values('type'))
            .fold()
            .as('attributes')
            .select('e', 'attributes')
            .by(valueMap())
            .by()
            """
        )
        result = result_set.one()
        if not result:
            return {}

        entity_data = result.get("e", {})
        attributes = result.get("attributes", [])
        return {
            "entity": entity_data.get("name", [""])[0],
            "description": entity_data.get("desc", [""])[0],
            "attributes": attributes
        }

    except Exception as e:
        logger.exception(f"Gremlin query failed for entity '{entity_name}'")
        raise

# # Run this sync code in a thread to avoid blocking FastAPI's event loop
async def get_all_vertices(skip: int = 0, limit: int = 10):
    return await asyncio.to_thread(_fetch_vertices, skip, limit)

async def count_vertices_by_label():
    return await asyncio.to_thread(_group_vertices_by_label)

async def get_vertex_schema_by_label():
    return await asyncio.to_thread(_fetch_vertex_schema)

async def get_entity_spec_from_graph(entity_name: str) -> dict:
    return await asyncio.to_thread(_run_spec_query, entity_name)