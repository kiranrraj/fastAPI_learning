#!/usr/bin/env python3
import os
import requests
import sys
import json

BASE_URL = os.getenv("TEST_BASE_URL", "http://localhost:8000/v1/search")
ENTITIES = ["company", "protocol", "site", "subject"]

def pretty(data):
    return json.dumps(data, indent=2, default=str)

def test_meta(entity):
    url = f"{BASE_URL}/{entity}/meta"
    try:
        r = requests.get(url, timeout=5)
        r.raise_for_status()
        data = r.json()
        for key in ("parameters", "response", "ui", "pagination"):
            if key not in data:
                print(f"[FAIL] {entity}/meta missing '{key}'")
                return False
        return True
    except Exception as e:
        print(f"[FAIL] META {entity}: {e}")
        return False

def test_search(entity):
    url = f"{BASE_URL}/{entity}"
    params = {"page": 1, "per_page": 2}
    try:
        r = requests.get(url, params=params, timeout=5)
        r.raise_for_status()
        data = r.json()
        for key in ("items", "page", "per_page", "total"):
            if key not in data:
                print(f"[FAIL] {entity} search missing key '{key}'")
                return False
        if not isinstance(data["items"], list):
            print(f"[FAIL] {entity} search 'items' is not a list")
            return False
        return True
    except Exception as e:
        print(f"[FAIL] SEARCH {entity}: {e}")
        return False

def main():
    results = {ent: {"meta": False, "search": False} for ent in ENTITIES}

    for ent in ENTITIES:
        results[ent]["meta"]   = test_meta(ent)
        results[ent]["search"] = test_search(ent)

    # Print summary
    print("\nTest Summary:")
    print(f"{'Entity':<10} {'Meta':<6} {'Search':<6}")
    print("-" * 25)
    for ent in ENTITIES:
        m = "PASS" if results[ent]["meta"] else "FAIL"
        s = "PASS" if results[ent]["search"] else "FAIL"
        print(f"{ent:<10} {m:<6} {s:<6}")

    # Exit code
    if any(not v["meta"] or not v["search"] for v in results.values()):
        sys.exit(1)
    else:
        print("\nAll tests passed!")
        sys.exit(0)

if __name__ == "__main__":
    main()
