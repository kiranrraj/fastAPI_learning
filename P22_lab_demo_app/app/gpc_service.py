from typing import List, Dict, Any, Union
import asyncio
from app.gremlin_client import get_gremlin_client, get_gremlin_traversal


def _fetch_vertices(skip: int = 0, limit: int = 10) -> List[Dict[str, Any]]:
    """Fetch vertices with pagination using Gremlin query."""
    g = get_gremlin_client()
    gremlin_query = f"g.V().range({skip}, {skip + limit}).elementMap()"
    result_set = g.submit(gremlin_query)
    return [r for r in result_set]


def _fetch_vertex_schema() -> Dict[str, List[str]]:
    """Fetch property keys grouped by vertex label."""
    g = get_gremlin_client()
    result_set = g.submit(
        "g.V().group().by(label).by(project('keys').by(properties().key().dedup().fold()))"
    )
    results = result_set.all().result()
    return results[0] if results else {}


def _group_vertices_by_label() -> Dict[str, int]:
    """Return a dict of vertex counts grouped by label."""
    g = get_gremlin_client()
    result_set = g.submit("g.V().groupCount().by(label)")
    return result_set.one()


def _create_vertex_in_graph(label: str, properties: Dict[str, Any]) -> Union[str, int]:
    """Create a new vertex and return its internal id."""
    g = get_gremlin_traversal()
    traversal = g.addV(label)
    for key, value in properties.items():
        traversal = traversal.property(key, value)
        
    # Important: Serialize to dict instead of returning raw vertex object
    result = traversal.valueMap(True).toList()
    return result[0] if result else {}


def _run_spec_query(entity_name: str) -> Dict[str, Any]:
    """Fetch specification metadata for an entity like Patient, Order, etc."""
    g = get_gremlin_client()
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


# --------- Async FastAPI-compatible wrappers ----------

async def get_all_vertices(skip: int = 0, limit: int = 10) -> List[Dict[str, Any]]:
    """Async version of vertex fetch with pagination."""
    return await asyncio.to_thread(_fetch_vertices, skip, limit)


async def count_vertices_by_label() -> Dict[str, int]:
    """Async wrapper to return vertex counts by label."""
    return await asyncio.to_thread(_group_vertices_by_label)


async def get_vertex_schema_by_label() -> Dict[str, List[str]]:
    """Async wrapper to get schema of all vertex labels."""
    return await asyncio.to_thread(_fetch_vertex_schema)


async def post_vertex_in_graph(label: str, properties: Dict[str, Any]) -> Union[str, int]:
    """Async wrapper to create a vertex in the graph."""
    return await asyncio.to_thread(_create_vertex_in_graph, label, properties)


async def get_entity_spec_from_graph(entity_name: str) -> Dict[str, Any]:
    """Async wrapper to get LabXEntity metadata."""
    return await asyncio.to_thread(_run_spec_query, entity_name)
