#!/usr/bin/env python3
import os
import sys
import json
import logging
from typing import Dict, Optional

from gremlin_python.structure.graph import Graph
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
from gremlin_python.driver.protocol import GremlinServerError
from gremlin_python.process.graph_traversal import __

# ─── Windows asyncio fix ────────────────────────────────────────────────────────
if os.name == "nt":
    import asyncio
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# ─── CONFIGURATION ──────────────────────────────────────────────────────────────
GREMLIN_ENDPOINT = os.getenv("GREMLIN_ENDPOINT", "ws://localhost:8182/gremlin")
BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "app", "data")
META_DIR = os.path.join(DATA_DIR, "metadata")

PROTECTED_KEYS = {"id", "label"}


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
        conn = DriverRemoteConnection(GREMLIN_ENDPOINT, "g")
        g = graph.traversal().withRemote(conn)
        logger.info(f"Connected to Gremlin at {GREMLIN_ENDPOINT}")
        return g
    except Exception as e:
        logger.error(f"Could not connect to Gremlin server: {e}")
        sys.exit(1)

def get_vertex_count(g, label: str) -> Optional[int]:
    try:
        return int(g.V().hasLabel(label).count().next())
    except Exception as e:
        logger.warning(f"Failed to fetch count for {label}: {e}")
        return None

def clear_graph(g) -> None:
    try:
        g.V().drop().iterate()
        logger.info("Graph cleared (all vertices & edges dropped).")
    except Exception as e:
        logger.error(f"Failed to clear graph: {e}")
        sys.exit(1)

# ─── VERTEX LOADER ──────────────────────────────────────────────────────────────
NUMERIC_PROPS = {"value"}

def load_vertices(g, label: str, records: list, batch_size: int = 50) -> int:
    inserted = 0
    total = len(records)
    for i in range(0, total, batch_size):
        batch = records[i:i + batch_size]
        for rec in batch:
            vid = rec.get("id", "<no-id>")
            trav = g.addV(label).property("id", vid)
            for k, v in rec.items():
                if k in PROTECTED_KEYS or isinstance(v, list) or isinstance(v, dict):
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
                    msg = str(e)
                    if "SchemaViolationException" in msg:
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


def upsert_edge(g, src_id: str, dst_id: str, label: str, edge_prop: Dict[str, any] = None) -> bool:
    edge_prop = edge_prop or {}
    step = g.V().has('id', src_id).coalesce(
        __.outE(label).where(__.inV().has('id', dst_id)),
        __.addE(label).to(__.V().has('id', dst_id))
    )
    for k, v in edge_prop.items():
        step = step.property(k, v)

    try:
        step.iterate()
        return True
    except Exception as e:
        logger.error(f"  ✗ Failed to upsert edge {label} {src_id}→{dst_id}: {e}")
        return False

# ─── MAIN ───────────────────────────────────────────────────────────────────────

def main():
    g = make_traversal_source()

    # 1) Fetch previous counts
    prev_counts = {}
    logger.info("Fetching existing counts…")
    for label, _ in ENTITIES + METADATA:
        prev_counts[label] = get_vertex_count(g, label)
        logger.info(f"  • {label:20} : {prev_counts[label]}")

    # 2) Clear graph
    logger.info("Clearing graph…")
    clear_graph(g)

    # 3) Load business data
    inserted, raw_data = {}, {}
    for label, fname in ENTITIES:
        path = os.path.join(DATA_DIR, fname)
        if not os.path.isfile(path):
            logger.warning(f"Missing file {fname}, skipping {label}")
            inserted[label] = 0
            continue
        with open(path, encoding="utf-8") as f:
            recs = json.load(f)
        raw_data[label] = recs
        logger.info(f"Loading {len(recs)} × {label}…")
        ok = load_vertices(g, label, recs)
        inserted[label] = ok
        logger.info(f"  → {label:20} inserted {ok}/{len(recs)}")

    # 4) Load metadata vertices
    for label, fname in METADATA:
        path = os.path.join(META_DIR, fname)
        if not os.path.isfile(path):
            logger.warning(f"Missing metadata file {fname}, skipping {label}")
            inserted[label] = 0
            continue
        with open(path, encoding="utf-8") as f:
            recs = json.load(f)
        logger.info(f"Loading {len(recs)} × {label}…")
        ok = load_vertices(g, label, recs)
        inserted[label] = ok
        logger.info(f"  → {label:20} inserted {ok}/{len(recs)}")

    # 5) Edge creation from nested fields
    logger.info("Creating business edges…")
    for inv in raw_data.get("Investigation", []):
        if "group_ids" in inv:
            for gid in inv["group_ids"]:
                upsert_edge(g, inv["id"], gid, "inGroup")

    for order in raw_data.get("Order", []):
        if "investigations" in order:
            for inv in order["investigations"]:
                upsert_edge(g, order["id"], inv["inv_id"], "includesInvestigation", {"group_id": inv.get("group_id", "")})

    for result in raw_data.get("Result", []):
        if "order_id" in result:
            upsert_edge(g, result["id"], result["order_id"], "ofOrder")
        if "values" in result:
            for val in result["values"]:
                upsert_edge(g, result["id"], val["inv_id"], "forInvestigation", {"value": float(val["value"])})

    # 6) Post-load counts
    logger.info("Fetching post-load counts…")
    post_counts = {}
    for label, _ in ENTITIES + METADATA:
        post_counts[label] = get_vertex_count(g, label)
        logger.info(f"  • {label:20} : {post_counts[label]}")

    # 7) Summary
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