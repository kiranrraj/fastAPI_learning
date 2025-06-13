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
DATA_DIR         = os.path.join(os.path.dirname(__file__), "app", "data")

ENTITIES = [
    ("Branch",               "branches.json"),
    ("Staff",                "staff.json"),
    ("Patient",              "patients.json"),
    ("InvestigationGroup",   "investigation_groups.json"),
    ("Investigation",        "investigations.json"),
    ("Order",                "orders.json"),
    ("Result",               "results.json"),
]

# ─── LOGGING SETUP ──────────────────────────────────────────────────────────────
logger = logging.getLogger("janusgraph-loader")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter("[%(asctime)s] %(levelname)s: %(message)s",
                                       datefmt="%Y-%m-%d %H:%M:%S"))
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
NUMERIC_PROPS = {"value"}  # if you expect numeric‐only props

def load_vertices(g, label: str, records: list) -> int:
    """
    Create one vertex per record, skipping any list‐valued fields
    (those will become edges later).
    """
    inserted = 0
    for rec in records:
        vid = rec.get("id", "<no-id>")
        trav = g.addV(label).property("id", vid)
        for k, v in rec.items():
            if k == "id" or isinstance(v, list):
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
    return inserted

# ─── EDGE “UPSERT” LOADER ───────────────────────────────────────────────────────

def upsert_edge(g, src_id: str, dst_id: str, label: str, edge_prop: Dict[str, any] = None) -> bool:
    """
    Idempotently add an edge of type label from the vertex whose 'id' property=src_id
    to the one whose 'id' property=dst_id, attaching any edge_prop.
    """
    edge_prop = edge_prop or {}
    # Start from the source vertex by property('id', src_id)
    step = g.V().has('id', src_id).coalesce(
        # 1) if this edge already exists, no-op
        __.outE(label).where(__.inV().has('id', dst_id)),
        # 2) otherwise add the edge via anonymous traversal
        __.addE(label).to(
            __.V().has('id', dst_id)
        )
    )
    # attach any edge properties
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

    # 1) PREVIOUS COUNTS
    prev_counts = {}
    logger.info("Fetching existing counts…")
    for label, _ in ENTITIES:
        prev_counts[label] = get_vertex_count(g, label)
        logger.info(f"  • {label:20} : {prev_counts[label]}")

    # 2) CLEAR GRAPH
    logger.info("Clearing graph…")
    clear_graph(g)

    # 3) LOAD VERTICES
    inserted = {}
    raw_data = {}
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

    # 4) UPSERT Investigation→InvestigationGroup edges
    logger.info("Upserting Investigation→Group edges…")
    for inv in raw_data.get("Investigation", []):
        for gid in inv.get("group_ids", []):
            upsert_edge(g, inv["id"], gid, "inGroup")

    # 5) UPSERT Order→Investigation edges (attach group_id)
    logger.info("Upserting Order→Investigation edges…")
    for order in raw_data.get("Order", []):
        for link in order.get("investigations", []):
            upsert_edge(
                g,
                order["id"],
                link["inv_id"],
                "includesInvestigation",
                {"group_id": link.get("group_id")}
            )

    # 6) UPSERT Result→Order edges
    logger.info("Upserting Result→Order edges…")
    for result in raw_data.get("Result", []):
        upsert_edge(g, result["id"], result["order_id"], "ofOrder")

    # 7) UPSERT Result→Investigation edges (attach value)
    logger.info("Upserting Result→Investigation edges…")
    for result in raw_data.get("Result", []):
        for val in result.get("values", []):
            upsert_edge(
                g,
                result["id"],
                val["inv_id"],
                "forInvestigation",
                {"value": float(val["value"])}
            )

    # 8) POST-LOAD COUNTS
    post_counts = {}
    logger.info("Fetching post-load counts…")
    for label, _ in ENTITIES:
        post_counts[label] = get_vertex_count(g, label)
        logger.info(f"  • {label:20} : {post_counts[label]}")

    # 9) SUMMARY
    logger.info("Summary (before → inserted → after):")
    for label, _ in ENTITIES:
        logger.info(f"  • {label:20} : "
                    f"{prev_counts[label]} → {inserted[label]} → {post_counts[label]}")

    # 10) CLEANUP
    try:
        g.remote_connection.close()
    except:
        pass
    logger.info("Data load complete.")

if __name__ == "__main__":
    main()
