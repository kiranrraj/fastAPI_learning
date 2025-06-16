import os, platform
import json, asyncio
import logging, time, random
from pathlib import Path
from gremlin_python.process.graph_traversal import __
from gremlin_python.structure.graph import Graph
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection

# Important for OSError: [WinError 87] The parameter is incorrect
if platform.system() == "Windows":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# ─── CONFIG ─────────────────────────────────────────────────────────────────────
PROJECT_ROOT = Path("D:/fast_api/fastAPI_learning/P22_lab_demo_app")
DATA_DIR = PROJECT_ROOT / "data"

# ─── LOGGING SETUP ──────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("edge-creator")

# ─── GREMLIN SETUP ──────────────────────────────────────────────────────────────
def make_traversal_source():
    try:
        graph = Graph()
        conn = DriverRemoteConnection(os.getenv("GREMLIN_ENDPOINT", "ws://localhost:8182/gremlin"), "g")
        g = graph.traversal().withRemote(conn)
        logger.info("Connected to Gremlin")
        return g
    except Exception as e:
        logger.error(f"Connection failed: {e}")
        raise

# ─── UTILS ──────────────────────────────────────────────────────────────────────
def load_json(filename):
    path = DATA_DIR / filename
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def retry_gremlin_op(op, max_retries=3, delay=1):
    for attempt in range(max_retries):
        try:
            op()
            return
        except Exception as e:
            if attempt < max_retries - 1:
                wait = delay * (2 ** attempt) + random.random()
                logger.warning(f"Retry {attempt + 1} after error: {e}. Waiting {wait:.2f}s...")
                time.sleep(wait)
            else:
                logger.error(f"Final attempt failed: {e}")

# You can now switch from "drop and recreate" to "skip if exists" by: drop_existing=False
def safe_add_edge(g, from_label, from_id, to_label, to_id, edge_label, drop_existing=True):
    """
    Creates an edge between two vertices.
    If drop_existing=True, it deletes existing matching edge before creating it.
    """
    try:
        if drop_existing:
            retry_gremlin_op(lambda: (
                g.V().has(from_label, "id", from_id)
                .outE(edge_label)
                .where(__.inV().has(to_label, "id", to_id))
                .drop()
                .iterate()
            ))

        retry_gremlin_op(lambda: (
            g.V().has(from_label, "id", from_id).as_("a")
            .V().has(to_label, "id", to_id)
            .addE(edge_label).from_("a")
            .iterate()
        ))
    except Exception as e:
        logger.warning(f"[{edge_label}] Failed for {from_label}({from_id}) → {to_label}({to_id}): {e}")


# ─── EDGE CREATION FUNCTIONS ────────────────────────────────────────────────────
def create_order_edges(g, orders, batch_size=10):
    logger.info("Creating 'orderedFor' and 'hasInvestigation' edges...")
    for i in range(0, len(orders), batch_size):
        batch = orders[i:i + batch_size]
        for order in batch:
            order_id = order["id"]
            patient_id = order.get("user_id")
            inv_list = order.get("investigations", [])

            safe_add_edge(g, "Order", order_id, "Patient", patient_id, "orderedFor", drop_existing=True)

            for inv in inv_list:
                inv_id = inv.get("inv_id")
                if inv_id:
                    safe_add_edge(g, "Order", order_id, "Investigation", inv_id, "hasInvestigation", drop_existing=True)

        logger.info(f"Processed {min(i + batch_size, len(orders))}/{len(orders)} orders.")

def create_result_edges(g, results, batch_size=10):
    logger.info("Creating 'resultOf' edges...")
    for i in range(0, len(results), batch_size):
        batch = results[i:i + batch_size]
        for result in batch:
            result_id = result["id"]
            order_id = result["order_id"]
            safe_add_edge(g, "Result", result_id, "Order", order_id, "resultOf", drop_existing=True)
        logger.info(f"Processed {min(i + batch_size, len(results))}/{len(results)} results.")

def create_in_group_edges(g, investigations, batch_size=10):
    logger.info("Creating 'inGroup' edges...")
    for i in range(0, len(investigations), batch_size):
        batch = investigations[i:i + batch_size]
        for inv in batch:
            inv_id = inv["id"]
            for gid in inv.get("group_ids", []):
                safe_add_edge(g, "Investigation", inv_id, "InvestigationGroup", gid, "inGroup", drop_existing=True)
        logger.info(f"Processed {min(i + batch_size, len(investigations))}/{len(investigations)} investigations.")

# ─── MAIN ───────────────────────────────────────────────────────────────────────
def create_edges():
    g = make_traversal_source()

    orders = load_json("orders.json")
    logger.info(f"Loaded {len(orders)} orders.")

    results = load_json("results.json")
    logger.info(f"Loaded {len(orders)} results.")

    investigations = load_json("investigations.json")
    logger.info(f"Loaded {len(orders)} investigations.")

    create_order_edges(g, orders)
    create_result_edges(g, results)
    create_in_group_edges(g, investigations)

    try:
        g.remote_connection.close()
    except Exception:
        pass

    logger.info("Edge creation complete.")

if __name__ == "__main__":
    create_edges()