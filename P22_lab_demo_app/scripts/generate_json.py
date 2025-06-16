import os
import json
import random
import uuid
from datetime import datetime
from pathlib import Path

# ─── Setup Paths ────────────────────────────────────────────────────────────────
PROJECT_ROOT = Path("D:/fast_api/fastAPI_learning/P13_1_fastapi_janus")
DATA_DIR     = PROJECT_ROOT / "app" / "data"
META_DIR     = DATA_DIR / "metadata"
CONSTANTS_FILE = PROJECT_ROOT / "constants.json"
INVESTIGATION_FILE = PROJECT_ROOT / "investigations.json"

DATA_DIR.mkdir(parents=True, exist_ok=True)
META_DIR.mkdir(parents=True, exist_ok=True)

# ─── Utility: Safe Write ────────────────────────────────────────────────────────
def write_json_file(path, data):
    if path.exists():
        path.unlink()
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Written {path.name}")

# ─── Load Constants ─────────────────────────────────────────────────────────────
with open(CONSTANTS_FILE, "r", encoding="utf-8") as f:
    CONST = json.load(f)

with open(INVESTIGATION_FILE, "r", encoding="utf-8") as f:
    INVESTIGATION_DATA = json.load(f)

now = datetime.now()

# ─── Record Counts ──────────────────────────────────────────────────────────────
COUNTS = {
    "branches": 10,
    "staff": 25,
    "patients": 80,
    "orders": 100,
    "results": 100
}

# ─── ID Generators ──────────────────────────────────────────────────────────────
def rand_digits(n): return ''.join(random.choices("0123456789", k=n))
def short(name): return name[:2].upper()

def generate_user_id(first, last):
    return f"{short(first)}{now.strftime('%y%m%d%H%M')}{short(last)}"

def generate_staff_id(first, last, role):
    return f"{short(first)}{short(role)}{now.strftime('%y%m%d')}{short(last)}{rand_digits(3)}"

def generate_branch_id(location):
    return f"{location[:4].upper()}{rand_digits(4)}"

def generate_group_id(name):
    return f"{name[:6].upper()}{rand_digits(8)}"

def generate_investigation_id(name, group_id):
    return f"{name[:4].upper()}{rand_digits(6)}{group_id[:4].upper()}"

def generate_order_id(user_id, branch_id, staff_id):
    return f"{user_id[:2]}{branch_id[:2]}{staff_id[:2]}{now.strftime('%y%m%d%H%S')}"

def generate_result_id(order_id):
    return f"{order_id.upper()}{rand_digits(3)}"

def random_address():
    return f"{random.randint(1, 200)}, {random.choice(['MG Road', 'Link Road', 'Nehru Street', 'Park Avenue'])}"

# ─── Business Data Generation ───────────────────────────────────────────────────
branches = []
for _ in range(COUNTS["branches"]):
    location = random.choice(CONST["locations"])
    branch = {
        "id": generate_branch_id(location),
        "branch_code": f"BR{rand_digits(3)}",
        "name": f"{location} Medical Center",
        "location": location,
        "address": random_address(),
        "phone": f"+91-{random.randint(60000,99999)}-{random.randint(10000,99999)}",
        "created_at": now.isoformat(),
        "updated_at": now.isoformat()
    }
    branches.append(branch)

staff = []
for _ in range(COUNTS["staff"]):
    first = random.choice(CONST["first_names"])
    last = random.choice(CONST["last_names"])
    role = random.choice(CONST["roles"])
    staff_id = generate_staff_id(first, last, role)
    staff.append({
        "id": staff_id,
        "staff_id": staff_id,
        "first_name": first,
        "last_name": last,
        "role": role,
        "branch_id": random.choice(branches)["id"],
        "created_at": now.isoformat(),
        "updated_at": now.isoformat()
    })

patients = []
for _ in range(COUNTS["patients"]):
    first = random.choice(CONST["first_names"])
    last = random.choice(CONST["last_names"])
    user_id = generate_user_id(first, last)
    patients.append({
        "id": user_id,
        "user_id": user_id,
        "first_name": first,
        "last_name": last,
        "gender": random.choice(CONST["genders"]),
        "age": random.randint(1, 90),
        "phone": f"+91-{random.randint(70000,99999)}-{random.randint(10000,99999)}",
        "created_at": now.isoformat(),
        "updated_at": now.isoformat()
    })

investigation_groups = []
investigations = []

for group in INVESTIGATION_DATA:
    group_id = generate_group_id(group["group_name"])
    investigation_groups.append({
        "id": group_id,
        "group_id": group_id,
        "name": group["group_name"],
        "description": f"Handles {group['group_name'].lower()} related tests",
        "parent_group_id": "",
        "created_at": now.isoformat(),
        "updated_at": now.isoformat()
    })
    for test in group["tests"]:
        inv_id = generate_investigation_id(test["name"], group_id)
        investigations.append({
            "id": inv_id,
            "investigation_id": inv_id,
            "name": test["name"],
            "unit": test["unit"],
            "reference_range": {
                "lower": test["lower"],
                "upper": test["upper"]
            },
            "group_ids": [],
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        })

orders = []
for _ in range(COUNTS["orders"]):
    patient = random.choice(patients)
    branch = random.choice(branches)
    doc = random.choice(staff)
    oid = generate_order_id(patient["id"], branch["id"], doc["id"])
    orders.append({
        "id": oid,
        "order_id": oid.upper(),
        "branch_id": branch["id"],
        "staff_id": doc["id"],
        "user_id": patient["id"],
        "created_at": now.isoformat(),
        "updated_at": now.isoformat(),
        "investigations": None
    })

results = []
for _ in range(COUNTS["results"]):
    order = random.choice(orders)
    res_id = generate_result_id(order["order_id"])
    results.append({
        "id": res_id,
        "result_id": res_id,
        "order_id": order["id"],
        "staff_id": order["staff_id"],
        "branch_id": order["branch_id"],
        "user_id": order["user_id"],
        "recorded_at": now.isoformat(),
        "updated_at": now.isoformat(),
        "report": None
    })

# ─── Write Business Data ────────────────────────────────────────────────────────
data_files = {
    "branches.json": branches,
    "staff.json": staff,
    "patients.json": patients,
    "investigation_groups.json": investigation_groups,
    "investigations.json": investigations,
    "orders.json": orders,
    "results.json": results,
}
for filename, data in data_files.items():
    write_json_file(DATA_DIR / filename, data)

# ─── Metadata Generation ────────────────────────────────────────────────────────
schema = {
    "Branch": [
        "id", "branch_code", "name", "location", "address", "phone", 
        "created_at", "updated_at"
    ],
    "Staff": [
        "id", "staff_id", "first_name", "last_name", "role", "branch_id",
        "created_at", "updated_at"
    ],
    "Patient": [
        "id", "user_id", "first_name", "last_name", "gender", "age", "phone",
        "created_at", "updated_at"
    ],
    "InvestigationGroup": [
        "id", "group_id", "name", "description", "parent_group_id",
        "created_at", "updated_at"
    ],
    "Investigation": [
        "id", "investigation_id", "name", "unit", "reference_range", "group_ids",
        "created_at", "updated_at"
    ],
    "Order": [
        "id", "order_id", "branch_id", "staff_id", "user_id",
        "created_at", "updated_at", "investigations"
    ],
    "Result": [
        "id", "result_id", "order_id", "staff_id", "branch_id", "user_id",
        "recorded_at", "updated_at", "report"
    ]
}
entities, attrs, edges = [], [], []
for label, keys in schema.items():
    eid = str(uuid.uuid4())
    entities.append({"id": eid, "name": label, "desc": f"{label} entity"})
    for key in keys:
        aid = str(uuid.uuid4())
        attrs.append({
            "id": aid,
            "name": key,
            "type": "text",
            "mandatory": key == "id",
            "desc": f"{key} field of {label}"
        })
        edges.append({"from": aid, "to": eid, "edge_label": "labx_attr_entity"})

write_json_file(META_DIR / "labx_entities.json", entities)
write_json_file(META_DIR / "labx_attrs.json", attrs)
write_json_file(META_DIR / "labx_edges.json", edges)