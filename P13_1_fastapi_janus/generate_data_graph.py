#!/usr/bin/env python3
import os
import json
import random
import uuid
from datetime import datetime, timedelta

# ─── CONFIGURATION ─────────────────────────────────────────────────────────────

PROJECT_ROOT   = os.path.dirname(os.path.abspath(__file__))
DATA_DIR       = os.path.join(PROJECT_ROOT, "app", "data")
os.makedirs(DATA_DIR, exist_ok=True)

# Number of records per entity
NUM_BRANCHES       = 10
NUM_STAFF          = 30
NUM_GROUPS         = 20
NUM_INVESTIGATIONS = 60
NUM_ORDERS         = 100
NUM_RESULTS        = NUM_ORDERS  # one result per order

now = datetime.now()

# ─── DATA POOLS ─────────────────────────────────────────────────────────────────

INDIAN_CITIES = [
    "Delhi","Mumbai","Bengaluru","Hyderabad","Chennai","Kolkata",
    "Pune","Ahmedabad","Jaipur","Lucknow","Kanpur","Nagpur",
    "Indore","Thane","Bhopal"
]

STREET_NAMES = [
    "MG Road","Brigade Road","Park Street","Anna Salai","Connaught Place",
    "Linking Road","Mount Road","Zakaria Street","Marine Drive",
    "Sector 17","Jubilee Hills"
]

FIRST_NAMES = [
    "Aarav","Vivaan","Aditya","Vihaan","Arjun","Ishaan","Sai","Ridhi",
    "Kriti","Neha","Saanvi","Ira","Myra","Kavya","Diya","Ananya",
    "Rohan","Tanvi","Karan","Anika","Reyansh","Aisha","Kavisha",
    "Krishna","Navya","Siddharth","Prisha","Aryan","Meera","Parth"
]

LAST_NAMES = [
    "Sharma","Verma","Patel","Gupta","Singh","Kumar","Reddy","Chowdhury",
    "Joshi","Mehta","Kapoor","Khan","Nair","Iyer","Mukherjee","Das",
    "Rao","Shah","Desai","Nambiar","Malhotra","Saxena","Chopra",
    "Bhattacharya","Aggarwal","Bose","Bhardwaj","Trivedi","Ghosh"
]

GENDERS = ["male","female","other","not_given"]

ROLES = [
    "Doctor","Nurse","Technician","Admin","Phlebotomist",
    "Lab Assistant","Receptionist","Radiologist"
]

INV_UNITS = [
    "mg/dL","mmol/L","IU/L","cells/µL","g/dL","pg/mL","ng/mL",
    "U/L","mEq/L","µmol/L","CFU/mL","ng/dL","pg/µL","cells/mm³"
]

GROUP_TYPES = [
    "Hematology","Hematology - Coagulation","Hematology - Morphology",
    "Biochemistry","Biochemistry - Lipid","Biochemistry - Enzyme",
    "Microbiology","Microbiology - Bacteriology","Microbiology - Virology",
    "Immunology","Immunology - Serology","Pathology","Pathology - Histology"
]

TEST_NAMES = [
    "Complete Blood Count","Lipid Profile","Liver Function Panel","Thyroid Panel",
    "Glucose Tolerance Test","Renal Function Test","Vitamin D Assay",
    "CRP Quantitative","Electrolyte Panel","Urinalysis","HbA1c","Blood Culture",
    "Prothrombin Time","Partial Thromboplastin Time","Blood Gas Analysis",
    "Iron Studies","Calcium Panel","Creatine Kinase","Amylase","Lipase",
    "Rheumatoid Factor","HIV Antibody","Hepatitis B Surface Antigen","TSH",
    "Free T3","Free T4","D-Dimer","Ferritin","Procalcitonin","ANA Screen",
    "Vitamin B12"
]

# ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────────

def random_indian_mobile() -> str:
    # 10-digit, starts with 6–9
    return str(random.randint(6000000000, 9999999999))

def timestamp_iso() -> str:
    # random datetime within last year
    dt = now - timedelta(days=random.randint(0,365),
                         hours=random.randint(0,23),
                         minutes=random.randint(0,59))
    return dt.isoformat()

# ─── 1) BRANCHES ───────────────────────────────────────────────────────────────

branches = []
for i in range(1, NUM_BRANCHES+1):
    city = random.choice(INDIAN_CITIES)
    code = city[:3].upper() + str(i).zfill(2)
    branches.append({
        "id":          str(uuid.uuid4()),
        "branch_code": code,
        "name":        f"{city} Medical Center",
        "location":    city,
        "address":     f"{random.randint(10,999)} {random.choice(STREET_NAMES)}",
        "phone":       random_indian_mobile(),
        "created_at":  timestamp_iso(),
        "updated_at":  timestamp_iso(),
    })

# ─── 2) STAFF ──────────────────────────────────────────────────────────────────

staff = []
for _ in range(NUM_STAFF):
    fn = random.choice(FIRST_NAMES)
    ln = random.choice(LAST_NAMES)
    sid = fn[:2].upper() + str(random.randint(1000,9999)) + ln[:2].upper()
    branch_id = random.choice(branches)["id"]
    staff.append({
        "id":          str(uuid.uuid4()),
        "staff_id":    sid,
        "first_name":  fn,
        "last_name":   ln,
        "role":        random.choice(ROLES),
        "branch_id":   branch_id,
        "created_at":  timestamp_iso(),
        "updated_at":  timestamp_iso(),
    })

# ─── 3) PATIENTS ───────────────────────────────────────────────────────────────

patients = []
for _ in range(NUM_ORDERS):
    fn = random.choice(FIRST_NAMES)
    ln = random.choice(LAST_NAMES)
    uid = fn[:2].upper() + str(random.randint(100000,999999)) + ln[:2].upper()
    patients.append({
        "id":          str(uuid.uuid4()),
        "user_id":     uid,
        "first_name":  fn,
        "last_name":   ln,
        "gender":      random.choice(GENDERS),
        "age":         random.randint(1,100),
        "phone":       random_indian_mobile(),
        "created_at":  timestamp_iso(),
        "updated_at":  timestamp_iso(),
    })

# ─── 4) INVESTIGATION GROUPS ─────────────────────────────────────────────────

groups = []
for i in range(1, NUM_GROUPS+1):
    name = f"{random.choice(GROUP_TYPES)} Group {i}"
    gid  = name.replace(" ", "")[:4].upper() + str(random.randint(0,9999)).zfill(4)
    groups.append({
        "id":              str(uuid.uuid4()),
        "group_id":        gid,
        "name":            name,
        "description":     f"Handles {name.split()[0].lower()} tests",
        "parent_group_id": None,
        "created_by":      random.choice(staff)["id"],
        "created_at":      timestamp_iso(),
        "updated_at":      timestamp_iso(),
    })
# assign ~30% a random parent (not themselves)
for g in groups:
    if random.random() < 0.3:
        parent = random.choice(groups)
        if parent["id"] != g["id"]:
            g["parent_group_id"] = parent["id"]

# ─── 5) INVESTIGATIONS ────────────────────────────────────────────────────────

investigations = []
for i in range(1, NUM_INVESTIGATIONS+1):
    test_name = random.choice(TEST_NAMES) + f" {i}"
    iid = test_name.replace(" ", "")[:4].upper() + str(random.randint(0,99999)).zfill(5)
    inv_groups = random.sample(groups, k=random.randint(1,3))
    investigations.append({
        "id":                str(uuid.uuid4()),
        "investigation_id":  iid,
        "name":              test_name,
        "unit":              random.choice(INV_UNITS),
        "reference_range":   f"{random.randint(10,50)}-{random.randint(51,100)}",
        "group_ids":         [g["id"] for g in inv_groups],
        "created_at":        timestamp_iso(),
        "updated_at":        timestamp_iso(),
    })

# ─── 6) ORDERS (TESTS) ─────────────────────────────────────────────────────────

orders = []
for _ in range(NUM_ORDERS):
    branch   = random.choice(branches)
    staff_m  = random.choice(staff)
    patient  = random.choice(patients)
    ts       = now - timedelta(days=random.randint(0,365),
                               hours=random.randint(0,23),
                               minutes=random.randint(0,59))
    order_ts = ts.isoformat()
    order_code = (
        branch["branch_code"]
        + staff_m["staff_id"]
        + patient["user_id"]
        + ts.strftime("%d%m%y%H%M%S")
    )
    chosen_invs = random.sample(investigations, k=random.randint(1,5))
    orders.append({
        "id":              str(uuid.uuid4()),
        "order_id":        order_code,
        "branch_id":       branch["id"],
        "staff_id":        staff_m["id"],
        "user_id":         patient["id"],
        "investigations": [
            {"inv_id": inv["id"], "group_id": random.choice(inv["group_ids"])}
            for inv in chosen_invs
        ],
        "created_at":      order_ts,
        "updated_at":      order_ts,
    })

# ─── 7) RESULTS ────────────────────────────────────────────────────────────────

results = []
for o in orders:
    rec_ts   = (datetime.fromisoformat(o["created_at"])
                + timedelta(hours=random.randint(1,48))).isoformat()
    result_code = o["order_id"]
    # build one float per investigation, never a string
    values = []
    for inv in o["investigations"]:
        if random.random() < 0.8:
            v = round(random.uniform(0,200), 2)
        else:
            # binary result encoded as float
            v = random.choice([1.0, 0.0])
        values.append({"inv_id": inv["inv_id"], "value": v})

    results.append({
        "id":           str(uuid.uuid4()),
        "result_id":    result_code,
        "order_id":     o["id"],
        "branch_id":    o["branch_id"],
        "staff_id":     o["staff_id"],
        "user_id":      o["user_id"],
        "recorded_at":  rec_ts,
        "updated_at":   rec_ts,
        "values":      values,
    })

# ─── WRITE ALL JSON FILES ─────────────────────────────────────────────────────

datasets = {
    "branches.json":             branches,
    "staff.json":                staff,
    "patients.json":             patients,
    "investigation_groups.json": groups,
    "investigations.json":       investigations,
    "orders.json":               orders,
    "results.json":              results,
}

for fname, data in datasets.items():
    path = os.path.join(DATA_DIR, fname)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Written {path}")
