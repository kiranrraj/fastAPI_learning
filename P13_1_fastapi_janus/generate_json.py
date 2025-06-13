#!/usr/bin/env python3
import os
import uuid
import random
import json
from datetime import datetime, timedelta

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(PROJECT_ROOT, "app", "data")
os.makedirs(DATA_DIR, exist_ok=True)  # create if missing

first_names = [
    "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
    "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
    "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
    "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
    "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa",
    "Edward", "Deborah"
]
last_names = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
    "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
    "Carter", "Roberts"
]
GENDERS = ["male", "female", "other", "not_given"]
ROLES = ["doctor", "nurse", "technician", "admin", "other"]
LOCATIONS = ["New York", "Los Angeles", "Chicago", "Houston", "Philadelphia",
             "Phoenix", "San Antonio", "San Diego", "Dallas", "San Jose"]
BRANCH_CODES = [f"BR{str(i).zfill(3)}" for i in range(1, 101)]
INVEST_UNITS = ["mg/dL", "mmol/L", "g/L", "IU/L", "cells/mcL"]
GROUP_CODES = [f"GRP{str(i).zfill(3)}" for i in range(1, 101)]

now = datetime.now()

# Generate 100 branches
branches = []
for i in range(100):
    branches.append({
        "id": str(uuid.uuid4()),
        "name": f"{random.choice(LOCATIONS)} Medical Center",
        "location": random.choice(LOCATIONS),
        "address": f"{random.randint(100,999)} {random.choice(['Main St', 'Oak Ave', 'Pine Rd', 'Maple Blvd'])}",
        "phone": f"+1-{random.randint(200,999)}-{random.randint(100,999)}-{random.randint(1000,9999)}",
        "branch_code": BRANCH_CODES[i],
        "created_at": (now - timedelta(days=random.randint(0,365))).isoformat()
    })

# Generate 100 patients
patients = []
for _ in range(100):
    patients.append({
        "id": str(uuid.uuid4()),
        "first_name": random.choice(first_names),
        "last_name": random.choice(last_names),
        "phone": f"+1-{random.randint(200,999)}-{random.randint(100,999)}-{random.randint(1000,9999)}",
        "gender": random.choice(GENDERS),
        "age": random.randint(0,100),
        "created_at": (now - timedelta(days=random.randint(0,365))).isoformat()
    })

# Generate 100 staff
staff = []
for _ in range(100):
    staff.append({
        "id": str(uuid.uuid4()),
        "first_name": random.choice(first_names),
        "last_name": random.choice(last_names),
        "role": random.choice(ROLES),
        "branch_id": random.choice(branches)["id"],
        "emp_id": f"EMP{random.randint(10000,99999)}",
        "created_at": (now - timedelta(days=random.randint(0,365))).isoformat()
    })

# Generate 100 investigation groups
investigation_groups = []
for i in range(100):
    ig = {
        "id": str(uuid.uuid4()),
        "name": f"{random.choice(['Hematology','Biochemistry','Microbiology','Immunology','Pathology'])} Group {i+1}",
        "description": f"Handles {random.choice(['blood','chemicals','bacteria','antibodies','tissue'])} investigations",
        "parent_group_id": None,
        "created_by": random.choice(staff)["id"],
        "group_code": GROUP_CODES[i],
        "created_at": (now - timedelta(days=random.randint(0,365))).isoformat()
    }
    investigation_groups.append(ig)
# Assign some parent groups
for ig in investigation_groups:
    if random.random() < 0.3:
        ig["parent_group_id"] = random.choice(investigation_groups)["id"]

# Generate 100 investigations
investigations = []
for i in range(100):
    investigations.append({
        "id": str(uuid.uuid4()),
        "name": f"{random.choice(['Complete Blood Count','Lipid Panel','Liver Function','Thyroid Panel','Glucose Test'])} {i+1}",
        "unit": random.choice(INVEST_UNITS),
        "reference_range": f"{random.randint(10,50)}-{random.randint(51,100)}" if random.random() < 0.8 else None,
        "group_id": random.choice(investigation_groups)["id"],
        "ordered_by": random.choice(staff)["id"] if random.random() < 0.8 else None,
        "investigation_id": f"INV{str(i+1).zfill(4)}",
        "created_at": (now - timedelta(days=random.randint(0,365))).isoformat()
    })

# Generate 100 investigation results
investigation_results = []
for _ in range(100):
    inv = random.choice(investigations)
    pat = random.choice(patients)
    stf = random.choice(staff)
    br = random.choice(branches)
    investigation_results.append({
        "id": str(uuid.uuid4()),
        "value": round(random.uniform(0,200),2) if random.random() < 0.8 else random.choice(["Positive","Negative"]),
        "unit": inv["unit"],
        "investigation_id": inv["id"],
        "patient_id": pat["id"],
        "staff_id": stf["id"],
        "branch_id": br["id"],
        "recorded_at": (now - timedelta(days=random.randint(0,365))).isoformat()
    })

# Write out each dataset
datasets = {
    "branches.json": branches,
    "patients.json": patients,
    "staff.json": staff,
    "investigation_groups.json": investigation_groups,
    "investigations.json": investigations,
    "investigation_results.json": investigation_results
}

for filename, data in datasets.items():
    out_path = os.path.join(DATA_DIR, filename)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Written {out_path}")
