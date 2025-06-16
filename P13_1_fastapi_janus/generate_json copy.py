import os
import json
import random
import uuid
from datetime import datetime, timedelta
from pathlib import Path

# ─── Setup Paths ────────────────────────────────────────────────────────────────
PROJECT_ROOT = Path("D:/fast_api/fastAPI_learning/P13_1_fastapi_janus")
DATA_DIR     = PROJECT_ROOT / "app" / "data"
META_DIR     = DATA_DIR / "metadata"
CONSTANTS_FILE = PROJECT_ROOT / "constants.json"

DATA_DIR.mkdir(parents=True, exist_ok=True)
META_DIR.mkdir(parents=True, exist_ok=True)

# ─── Utility: Safe Write ────────────────────────────────────────────────────────
def write_json_file(path, data):
    if path.exists():
        path.unlink()
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"✔ Written {path.name}")

# ─── Load Constants ─────────────────────────────────────────────────────────────
with open(CONSTANTS_FILE, "r", encoding="utf-8") as f:
    CONST = json.load(f)

now = datetime.now()

# ─── Record Counts ──────────────────────────────────────────────────────────────
COUNTS = {
    "branches": 10,
    "staff": 25,
    "patients": 80,
    "investigation_groups": 15,
    "investigations": 60,
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
        "name": f"{location} Medical Center",
        "location": location,
        "address": random_address(),
        "phone": f"+91-{random.randint(60000,99999)}-{random.randint(10000,99999)}",
        "branch_code": f"BR{rand_digits(3)}",
        "created_at": now.isoformat()
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
        "first_name": first,
        "last_name": last,
        "role": role,
        "branch_id": random.choice(branches)["id"],
        "emp_id": f"EMP{rand_digits(5)}",
        "created_at": now.isoformat()
    })

patients = []
for _ in range(COUNTS["patients"]):
    first = random.choice(CONST["first_names"])
    last = random.choice(CONST["last_names"])
    user_id = generate_user_id(first, last)
    patients.append({
        "id": user_id,
        "first_name": first,
        "last_name": last,
        "phone": f"+91-{random.randint(70000,99999)}-{random.randint(10000,99999)}",
        "gender": random.choice(CONST["genders"]),
        "age": random.randint(1, 90),
        "created_at": now.isoformat()
    })

investigation_groups = []
for name in CONST["group_names"][:COUNTS["investigation_groups"]]:
    igid = generate_group_id(name)
    investigation_groups.append({
        "id": igid,
        "name": f"{name} Group",
        "description": f"Handles {name.lower()} related tests",
        "created_by": random.choice(staff)["id"],
        "group_code": f"GRP{rand_digits(3)}",
        "created_at": now.isoformat()
    })

investigations = []
for i in range(COUNTS["investigations"]):
    test_name = CONST["test_names"][i % len(CONST["test_names"])]
    group = random.choice(investigation_groups)
    inv_id = generate_investigation_id(test_name, group["id"])
    investigations.append({
        "id": inv_id,
        "name": test_name,
        "unit": random.choice(["mg/dL", "mmol/L", "IU/L"]),
        "reference_range": f"{random.randint(10, 50)}-{random.randint(51, 100)}",
        "group_id": group["id"],
        "ordered_by": random.choice(staff)["id"],
        "investigation_id": inv_id,
        "created_at": now.isoformat()
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
        "user_id": patient["id"],
        "branch_id": branch["id"],
        "staff_id": doc["id"],
        "created_at": now.isoformat(),
        "updated_at": now.isoformat()
    })

results = []
for _ in range(COUNTS["results"]):
    order = random.choice(orders)
    res_id = generate_result_id(order["order_id"])
    results.append({
        "id": res_id,
        "result_id": res_id,
        "order_id": order["id"],
        "user_id": order["user_id"],
        "staff_id": order["staff_id"],
        "branch_id": order["branch_id"],
        "updated_at": now.isoformat(),
        "recorded_at": now.isoformat()
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
    "InvestigationGroup": ["group_code", "name", "created_at", "id", "description", "created_by"],
    "Order": ["updated_at", "created_at", "id", "branch_id", "staff_id", "user_id", "order_id"],
    "Branch": ["branch_code", "address", "phone", "name", "created_at", "location", "id"],
    "Staff": ["emp_id", "created_at", "id", "role", "branch_id", "last_name", "first_name"],
    "Investigation": ["ordered_by", "name", "created_at", "id", "group_id", "unit", "investigation_id", "reference_range"],
    "Patient": ["phone", "created_at", "id", "last_name", "first_name", "gender", "age"],
    "Result": ["updated_at", "id", "branch_id", "staff_id", "user_id", "order_id", "recorded_at", "result_id"]
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
