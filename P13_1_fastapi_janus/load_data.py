#!/usr/bin/env python3
import os
import sys
import json
import logging
from typing import Dict, Optional

from gremlin_python.structure.graph import Graph
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
from gremlin_python.driver.protocol import GremlinServerError

if os.name == "nt":
    import asyncio
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# ─── Configuration ─────────────────────────────────────────────────────────────

# Gremlin endpoint, e.g. "ws://localhost:8182/gremlin"
GREMLIN_ENDPOINT = os.getenv("GREMLIN_ENDPOINT", "ws://localhost:8182/gremlin")

# Directory where your JSON files live, relative to this script
DATA_DIR = os.path.join(os.path.dirname(__file__), "app", "data")

# The labels and filenames to process
ENTITIES = [
    ("Patient",               "patients.json"),
    ("Staff",                 "staff.json"),
    ("Branch",                "branches.json"),
    ("InvestigationGroup",    "investigation_groups.json"),
    ("Investigation",         "investigations.json"),
    ("InvestigationResult",   "investigation_results.json"),
]

# ─── Logging Setup ─────────────────────────────────────────────────────────────

logger = logging.getLogger("janusgraph-loader")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter("[%(asctime)s] %(levelname)s: %(message)s",
                                       datefmt="%Y-%m-%d %H:%M:%S"))
logger.addHandler(handler)

# ─── JanusGraph Client Helpers ─────────────────────────────────────────────────

def make_traversal_source() -> Graph:
    """
    Connect to JanusGraph via Gremlin Server and return a traversal source.
    """
    graph = Graph()
    try:
        conn = DriverRemoteConnection(GREMLIN_ENDPOINT, "g")
        g = graph.traversal().withRemote(conn)
        logger.info(f"Connected to Gremlin at {GREMLIN_ENDPOINT}")
        return g
    except Exception as e:
        logger.error(f"Failed to connect to Gremlin endpoint: {e}")
        sys.exit(1)

def get_vertex_count(g, label: str) -> Optional[int]:
    """
    Return the number of vertices with the given label, or None on error.
    """
    try:
        count = g.V().hasLabel(label).count().next()
        return int(count)
    except Exception as e:
        logger.warning(f"Could not fetch count for '{label}': {e}")
        return None

def clear_graph(g) -> None:
    """
    Drop all vertices (and edges) from the graph.
    """
    try:
        g.V().drop().iterate()
        logger.info("Graph cleared successfully.")
    except Exception as e:
        logger.error(f"Failed to clear graph: {e}")
        sys.exit(1)

# ─── Updated load_vertices with numeric conversion for `value` ───────────────────

# Properties that your JanusGraph schema expects as doubles
NUMERIC_PROPS = {"value"}

# Map the JSON strings to floats instead of skipping
VALUE_MAP = {
    "Positive": 1.0,
    "Negative": 0.0
}

def load_vertices(g, label: str, records: list) -> int:
    """
    Insert the given records as vertices with the specified label.
    Returns the number of successful inserts.
    """
    success = 0
    for rec in records:
        vid = rec.get("id", "<no-id>")
        trav = g.addV(label).property("id", vid)
        for k, v in rec.items():
            if k == "id":
                continue

            # Handle numeric props, mapping or casting as needed
            if k in NUMERIC_PROPS:
                if isinstance(v, str) and v in VALUE_MAP:
                    v = VALUE_MAP[v]
                else:
                    try:
                        v = float(v)
                    except (ValueError, TypeError):
                        logger.warning(
                            f"Skipping property '{k}' on {label} {vid}: "
                            f"cannot convert '{rec[k]}' to float"
                        )
                        continue

            # Attach the property, catching schema violations
            try:
                trav = trav.property(k, v)
            except GremlinServerError as e:
                if "SchemaViolationException" in str(e):
                    logger.warning(
                        f"Schema mismatch on {label} {vid} prop '{k}': {e.status['message']}"
                    )
                    continue
                else:
                    raise

        # Finally iterate the traversal to perform the insert
        try:
            trav.iterate()
            success += 1
        except Exception as e:
            logger.error(f"Failed to insert {label} {vid}: {e}")

    return success

# ─── Main Execution ─────────────────────────────────────────────────────────────

def main():
    # 1) Connect
    g = make_traversal_source()

    # 2) PREVIOUS COUNTS
    prev_counts: Dict[str, Optional[int]] = {}
    logger.info("Fetching existing vertex counts…")
    for label, _ in ENTITIES:
        cnt = get_vertex_count(g, label)
        prev_counts[label] = cnt
        logger.info(f"  {label:20} : {cnt if cnt is not None else '?'}")

    # 3) CLEAR GRAPH
    logger.info("Dropping all existing vertices and edges…")
    clear_graph(g)

    # 4) LOAD NEW DATA
    inserted_counts: Dict[str, int] = {}
    for label, filename in ENTITIES:
        path = os.path.join(DATA_DIR, filename)
        if not os.path.isfile(path):
            logger.warning(f"Skipping missing file: {filename}")
            inserted_counts[label] = 0
            continue

        # Read JSON
        try:
            with open(path, encoding="utf-8") as f:
                records = json.load(f)
        except Exception as e:
            logger.error(f"Error reading {filename}: {e}")
            inserted_counts[label] = 0
            continue

        total = len(records)
        logger.info(f"Loading {total} records for '{label}' from '{filename}'…")
        inserted = load_vertices(g, label, records)
        inserted_counts[label] = inserted
        logger.info(f"  → Successfully inserted {inserted}/{total} {label} vertices")

    # 5) POST-LOAD COUNTS
    post_counts: Dict[str, Optional[int]] = {}
    logger.info("Fetching post-load vertex counts…")
    for label, _ in ENTITIES:
        cnt = get_vertex_count(g, label)
        post_counts[label] = cnt
        logger.info(f"  {label:20} : {cnt if cnt is not None else '?'}")

    # 6) SUMMARY
    logger.info("Summary (previous → inserted → current):")
    for label, _ in ENTITIES:
        prev = prev_counts.get(label, "?")
        ins  = inserted_counts.get(label, 0)
        post = post_counts.get(label, "?")
        logger.info(f"  {label:20} : {prev} → {ins} → {post}")

    # 7) Close connection
    try:
        g.remote_connection.close()
    except Exception:
        pass

    logger.info("Data load operation complete.")

if __name__ == "__main__":
    main()
