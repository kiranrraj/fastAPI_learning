import os
import json
import random
import logging
from datetime import datetime
from pathlib import Path

# ─── Setup Logging ──────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

# ─── Setup Paths ────────────────────────────────────────────────────────────────
PROJECT_ROOT = Path("D:/fast_api/fastAPI_learning/P13_1_fastapi_janus")
DATA_DIR = PROJECT_ROOT / "app" / "data"

# ─── File Paths ─────────────────────────────────────────────────────────────────
FILES = {
    "INVESTIGATION_GROUPS": DATA_DIR / "investigation_groups.json",
    "INVESTIGATIONS": DATA_DIR / "investigations.json",
    "ORDERS": DATA_DIR / "orders.json",
    "RESULTS": DATA_DIR / "results.json"
}

# ─── Utility ────────────────────────────────────────────────────────────────────
def load_json(path_name):
    path = FILES[path_name]
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        logging.info(f"Loaded {path.name} successfully.")
        return data
    except Exception as e:
        logging.error(f"Failed to load {path.name}: {e}")
        return []

def save_json(path_name, data):
    path = FILES[path_name]
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        logging.info(f"✔ Updated {path.name}")
    except Exception as e:
        logging.error(f"Failed to write {path.name}: {e}")

# ─── Load Files ─────────────────────────────────────────────────────────────────
groups = load_json("INVESTIGATION_GROUPS")
investigations = load_json("INVESTIGATIONS")
orders = load_json("ORDERS")
results = load_json("RESULTS")

# ─── Enrichment ─────────────────────────────────────────────────────────────────
logging.info("Starting data enrichment...")

# Update parent_group_id (~30% of groups)
group_ids = [g["id"] for g in groups]
for g in groups:
    g["parent_group_id"] = random.choice(group_ids) if random.random() < 0.3 else ""
logging.info("Updated parent_group_id in investigation_groups.")

# Update group_ids in investigations (1–2 per investigation)
for inv in investigations:
    inv["group_ids"] = random.sample(group_ids, k=random.choice([1, 2]))
logging.info("Assigned group_ids to investigations.")

# Update investigations in orders (1–3 investigations per order)
inv_ids = [i["id"] for i in investigations]
group_map = {inv["id"]: inv["group_ids"][0] if inv["group_ids"] else "" for inv in investigations}
for order in orders:
    selected = random.sample(inv_ids, k=random.randint(1, 3))
    order["investigations"] = [{"inv_id": iid, "group_id": group_map.get(iid, "")} for iid in selected]
logging.info("Populated investigations field in orders.")

# Update report in results based on related order
investigation_lookup = {inv["id"]: inv for inv in investigations}
for result in results:
    related_order = next((o for o in orders if o["id"] == result["order_id"]), None)
    if not related_order or not related_order.get("investigations"):
        result["report"] = None
        continue

    report = []
    for item in related_order["investigations"]:
        inv = investigation_lookup.get(item["inv_id"])
        if not inv:
            continue
        ref = inv.get("reference_range", {})
        lower = ref.get("lower", 0)
        upper = ref.get("upper", 0)
        if lower >= upper:
            logging.warning(f"Invalid range for investigation {inv['id']}")
            continue
        value = round(random.uniform(lower * 0.7, upper * 1.3), 2)
        observation = "abnormal" if value < lower or value > upper else "normal"
        status = "+ve" if observation == "abnormal" else "-ve"
        report.append({
            "inv_id": inv["id"],
            "value": value,
            "range": [lower, upper],
            "observation": observation,
            "status": status
        })
    result["report"] = report
logging.info("Generated report data for results.")

# ─── Save Files ─────────────────────────────────────────────────────────────────
save_json("INVESTIGATION_GROUPS", groups)
save_json("INVESTIGATIONS", investigations)
save_json("ORDERS", orders)
save_json("RESULTS", results)

logging.info("Enrichment process completed.")