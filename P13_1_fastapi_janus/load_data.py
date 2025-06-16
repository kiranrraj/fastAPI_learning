# load_data.py

#!/usr/bin/env python3
import os
import sys
import json
import logging, time
from typing import Dict, Optional
from pathlib import Path

from gremlin_python.structure.graph import Graph
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
from gremlin_python.driver.protocol import GremlinServerError
from gremlin_python.process.graph_traversal import __

# ─── Windows asyncio fix ────────────────────────────────────────────────────────
if os.name == "nt":
    import asyncio
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# ─── CONFIGURATION ──────────────────────────────────────────────────────────────
PROJECT_ROOT = Path("D:/fast_api/fastAPI_learning/P22_lab_demo_app")
DATA_DIR = PROJECT_ROOT / "data"
META_DIR = DATA_DIR / "metadata"

PROTECTED_KEYS = {"id", "label"}
NUMERIC_PROPS = {"value"}

ENTITIES = [
    ("Branch",               "branches.json"),
    ("Staff",                "staff.json"),
    ("Patient",              "patients.json"),
    ("InvestigationGroup",   "investigation_groups.json"),
    ("Investigation",        "investigations.json"),
    ("Order",                "orders.json"),
    ("Result",               "results.json"),
]

METADATA = [
    ("LabXEntity", "labx_entities.json"),
    ("LabXAttr", "labx_attrs.json"),
    ("LabXEdge", "labx_edges.json")
]

# ─── LOGGING SETUP ──────────────────────────────────────────────────────────────
logger = logging.getLogger("janusgraph-loader")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter("[%(asctime)s] %(levelname)s: %(message)s", datefmt="%Y-%m-%d %H:%M:%S"))
logger.addHandler(handler)

# ─── JANUSGRAPH HELPERS ─────────────────────────────────────────────────────────
def make_traversal_source() -> Graph:
    graph = Graph()
    try:
        conn = DriverRemoteConnection(os.getenv("GREMLIN_ENDPOINT", "ws://localhost:8182/gremlin"), "g")
        g = graph.traversal().withRemote(conn)
        logger.info("Connected to Gremlin at ws://localhost:8182/gremlin")
        return g
    except Exception as e:
        logger.error(f"Could not connect to Gremlin server: {e}")
        sys.exit(1)

def get_vertex_count(g, label: str, retries: int = 3, delay: float = 2.0) -> Optional[int]:
    for attempt in range(1, retries + 1):
        try:
            return int(g.V().hasLabel(label).count().next())
        except Exception as e:
            logger.warning(f"Attempt {attempt}/{retries} failed to fetch count for {label}: {e}")
            if attempt < retries:
                time.sleep(delay * attempt)  # exponential backoff
            else:
                logger.warning(f"  • Skipping count for {label} after {retries} attempts.")
                return None

def clear_graph(g) -> None:
    try:
        g.V().drop().iterate()
        logger.info("Graph cleared (all vertices & edges dropped).")
    except Exception as e:
        logger.error(f"Failed to clear graph: {e}")
        sys.exit(1)

# ─── VERTEX LOADER ──────────────────────────────────────────────────────────────
def load_vertices(g, label: str, records: list, batch_size: int = 10) -> int:
    inserted = 0
    total = len(records)
    for i in range(0, total, batch_size):
        batch = records[i:i + batch_size]
        for rec in batch:
            vid = rec.get("id", "<no-id>")
            trav = g.addV(label).property("id", vid)
            for k, v in rec.items():
                if k in PROTECTED_KEYS or isinstance(v, (list, dict)):
                    continue
                if k in NUMERIC_PROPS:
                    try:
                        v = float(v)
                    except Exception:
                        logger.warning(f"  • [skip] non-numeric {k} on {label} {vid}")
                        continue
                try:
                    trav = trav.property(k, v)
                except GremlinServerError as e:
                    if "SchemaViolationException" in str(e):
                        logger.warning(f"  • [schema mismatch] {label}.{k} on {vid}: {e.status['message']}")
                        continue
                    else:
                        raise
            try:
                trav.iterate()
                inserted += 1
            except Exception as e:
                logger.error(f"  ✗ Failed to insert {label} {vid}: {e}")
        logger.info(f"Inserted batch {i + 1}–{min(i + batch_size, total)} of {total}")
    return inserted

# ─── MAIN ───────────────────────────────────────────────────────────────────────
def main():
    g = make_traversal_source()

    prev_counts = {}
    logger.info("Fetching existing counts…")
    for label, _ in ENTITIES + METADATA:
        prev_counts[label] = get_vertex_count(g, label)
        logger.info(f"  • {label:20} : {prev_counts[label]}")

    logger.info("Clearing graph…")
    clear_graph(g)

    inserted, raw_data = {}, {}
    for label, fname in ENTITIES:
        path = DATA_DIR / fname
        if not path.is_file():
            logger.warning(f"Missing file {fname}, skipping {label}")
            inserted[label] = 0
            continue
        with open(path, encoding="utf-8") as f:
            recs = json.load(f)
        raw_data[label] = recs
        logger.info(f"Loading {len(recs)} × {label}…")
        ok = load_vertices(g, label, recs, batch_size=10)
        inserted[label] = ok
        logger.info(f"  → {label:20} inserted {ok}/{len(recs)}")

    for label, fname in METADATA:
        path = META_DIR / fname
        if not path.is_file():
            logger.warning(f"Missing metadata file {fname}, skipping {label}")
            inserted[label] = 0
            continue
        with open(path, encoding="utf-8") as f:
            recs = json.load(f)
        logger.info(f"Loading {len(recs)} × {label}…")
        ok = load_vertices(g, label, recs, batch_size=10)
        inserted[label] = ok
        logger.info(f"  → {label:20} inserted {ok}/{len(recs)}")

    logger.info("Fetching post-load counts…")
    post_counts = {}
    for label, _ in ENTITIES + METADATA:
        post_counts[label] = get_vertex_count(g, label)
        logger.info(f"  • {label:20} : {post_counts[label]}")

    logger.info("Summary (before → inserted → after):")
    for label, _ in ENTITIES + METADATA:
        logger.info(f"  • {label:20} : {prev_counts[label]} → {inserted[label]} → {post_counts[label]}")

    try:
        g.remote_connection.close()
    except Exception:
        pass
    logger.info("Data load complete.")

if __name__ == "__main__":
    main()