#!/usr/bin/env python3
import os
import sys
import logging
import requests
from time import sleep
import json
from typing import Dict, Any
import time # Added: Import the 'time' module

# ——— Configuration ———
BASE_URL        = "http://127.0.0.1:8100"
LOGIN_URL       = BASE_URL + "/api/v1/auth/login"
ME_URL          = BASE_URL + "/api/v1/users/me"
COMPANIES_URL   = BASE_URL + "/api/v1/companies"
NOTIFS_URL      = BASE_URL + "/api/v1/notifications"
PORTLETS_URL    = BASE_URL + "/api/v1/portlets"

USERNAME = "KiranRaj008351"
PASSWORD = USERNAME

# ——— Logging Setup ———
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("test_api")

# Global counter for failed tests
FAILED_TEST_COUNT = 0

def retry_request(method: str, url: str, **kwargs: Any) -> requests.Response:
    """
    Attempts an HTTP request up to 3 times with a short back-off.
    Logs request details and response status/body.
    """
    for attempt in range(1, 4):
        logger.info(f"→ REQUEST {method} {url} (attempt {attempt})")
        if "headers" in kwargs:
            logger.debug(f"  headers: {kwargs['headers']}") # Use debug for headers, can contain sensitive info
        if "data" in kwargs:
            logger.debug(f"  data: {kwargs['data']}")
        if "json" in kwargs:
            logger.debug(f"  json: {json.dumps(kwargs['json'], indent=2)}")
        try:
            resp = requests.request(method, url, timeout=10, **kwargs) # Increased timeout for stability
            logger.info(f"← RESPONSE {resp.status_code}")
            try:
                # Log JSON response body if available and valid
                logger.debug(f"  body: {json.dumps(resp.json(), indent=2)}")
            except json.JSONDecodeError:
                # Log raw text body if not JSON
                logger.debug(f"  body: {resp.text}")
            return resp
        except requests.exceptions.RequestException as e:
            logger.warning(f"REQUEST failed: {e}")
            if attempt < 3:
                sleep(2) # Increased sleep for better back-off
            else:
                logger.error(f"Giving up on {method} {url} after 3 attempts due to: {e}")
                sys.exit(1) # Exit if request fails after retries

def auth_headers(token: str) -> Dict[str, str]:
    """Returns authorization headers."""
    return {"Authorization": f"Bearer {token}"}

def assert_and_log(condition: bool, success_msg: str, failure_msg: str, exit_on_fail: bool = True):
    """
    Checks a condition, logs success or failure, and optionally exits.
    Increments FAILED_TEST_COUNT on failure.
    """
    global FAILED_TEST_COUNT
    if condition:
        logger.info(f"SUCCESS: {success_msg}")
    else:
        logger.error(f"FAILED: {failure_msg}")
        FAILED_TEST_COUNT += 1
        if exit_on_fail:
            sys.exit(1)

def main():
    global FAILED_TEST_COUNT
    FAILED_TEST_COUNT = 0 # Reset for each run

    logger.info("=======================================")
    logger.info(" Starting API Test Suite ")
    logger.info("=======================================")

    # 1) LOGIN
    logger.info("\n=== TEST: User Login ===")
    r = retry_request("POST", LOGIN_URL, data={"username": USERNAME, "password": PASSWORD})
    assert_and_log(r.status_code == 200, "Login successful.", f"Login failed: Status {r.status_code}, Response: {r.text}")
    token = r.json().get("access_token")
    assert_and_log(token is not None, "Access token received.", "No access_token in login response.", exit_on_fail=True)
    logger.info("Login test completed.")

    # 2) ROOT & HEALTH
    logger.info("\n=== TEST: Root and Health Endpoints ===")
    r = retry_request("GET", BASE_URL + "/")
    assert_and_log(r.status_code == 200, "Root endpoint returned 200 OK.", f"Root endpoint failed: Status {r.status_code}, Response: {r.text}")
    assert_and_log(r.json() == {"message": "Welcome to GBeeX API"}, "Root message is correct.", f"Root message mismatch: Expected 'Welcome to GBeeX API', Got {r.json()}")

    r = retry_request("GET", BASE_URL + "/health")
    assert_and_log(r.status_code == 200, "Health endpoint returned 200 OK.", f"Health endpoint failed: Status {r.status_code}, Response: {r.text}")
    assert_and_log(r.json().get("status") == "ok", "Health status is 'ok'.", f"Health status mismatch: Expected 'ok', Got {r.json().get('status')}")
    logger.info("Root and Health tests completed.")

    # 3) INVALID LOGIN
    logger.info("\n=== TEST: Invalid Login Attempts ===")
    r = retry_request("POST", LOGIN_URL, data={"username":"wrong","password":"wrong"})
    assert_and_log(r.status_code == 401, "Invalid credentials correctly rejected (401).", f"Invalid login expected 401, got {r.status_code}, Response: {r.text}")
    logger.info("Invalid login test completed.")

    # 4) /users/me
    logger.info("\n=== TEST: Get Current User (/users/me) ===")
    r = retry_request("GET", ME_URL, headers=auth_headers(token))
    assert_and_log(r.status_code == 200, "/users/me returned 200 OK.", f"/users/me failed: Status {r.status_code}, Response: {r.text}")
    user_data = r.json()
    assert_and_log(user_data.get("username") == USERNAME, f"User data username matches expected '{USERNAME}'.", f"Username mismatch: Expected '{USERNAME}', Got '{user_data.get('username')}'")
    logger.info("Get Current User test completed.")

    # 5) companies list & detail
    logger.info("\n=== TEST: Companies Endpoints ===")
    r = retry_request("GET", COMPANIES_URL, headers=auth_headers(token))
    assert_and_log(r.status_code == 200, "/companies list returned 200 OK.", f"/companies list failed: Status {r.status_code}, Response: {r.text}")
    comps = r.json()
    assert_and_log(isinstance(comps, list) and len(comps) > 0, "Companies list is a non-empty list.", f"Companies list is empty or not a list: {comps}")
    cid = comps[0].get("companyId")
    assert_and_log(cid is not None, "First company has 'companyId'.", "First company in list missing 'companyId'.")

    r = retry_request("GET", f"{COMPANIES_URL}/{cid}", headers=auth_headers(token))
    assert_and_log(r.status_code == 200, f"/companies/{cid} returned 200 OK.", f"/companies/{cid} failed: Status {r.status_code}, Response: {r.text}")
    assert_and_log(r.json().get("companyId") == cid, "Company detail matches requested ID.", f"Company detail ID mismatch: Expected '{cid}', Got '{r.json().get('companyId')}'")
    logger.info("Companies endpoints tests completed.")

    # 6) protocols & sites
    logger.info("\n=== TEST: Protocols and Sites Endpoints ===")
    r = retry_request("GET", f"{COMPANIES_URL}/{cid}/protocols", headers=auth_headers(token))
    assert_and_log(r.status_code == 200, "Protocols list returned 200 OK.", f"/protocols list failed: Status {r.status_code}, Response: {r.text}")
    prots = r.json()
    assert_and_log(isinstance(prots, list) and len(prots) > 0, "Protocols list is a non-empty list.", f"Protocols list is empty or not a list: {prots}")
    pid = prots[0].get("protocolId")
    assert_and_log(pid is not None, "First protocol has 'protocolId'.", "First protocol in list missing 'protocolId'.")

    r = retry_request("GET", f"{BASE_URL}/api/v1/protocols/{pid}/sites", headers=auth_headers(token))
    assert_and_log(r.status_code == 200, "Sites list for protocol returned 200 OK.", f"/sites failed: Status {r.status_code}, Response: {r.text}")
    assert_and_log(isinstance(r.json(), list) and len(r.json()) > 0, "Sites list is a non-empty list.", f"Sites list is empty or not a list: {r.json()}")
    logger.info("Protocols and Sites tests completed.")

    # 7) notifications & mark-read
    logger.info("\n=== TEST: Notifications Endpoints ===")
    r = retry_request("GET", NOTIFS_URL, headers=auth_headers(token))
    assert_and_log(r.status_code == 200, "/notifications returned 200 OK.", f"/notifications failed: Status {r.status_code}, Response: {r.text}")
    notifs = r.json()
    assert_and_log(isinstance(notifs, list), "Notifications list is a list.", "Notifications response is not a list.")

    if notifs:
        nid = notifs[0].get("id")
        assert_and_log(nid is not None, "First notification has 'id'.", "First notification in list missing 'id'.")

        r = retry_request("POST", f"{NOTIFS_URL}/{nid}/read", headers=auth_headers(token))
        assert_and_log(r.status_code == 200, "Mark-read returned 200 OK.", f"Mark-read failed: Status {r.status_code}, Response: {r.text}")
        assert_and_log(r.json().get("status") == "ok", "Mark-read status is 'ok'.", f"Mark-read response status mismatch: {r.json()}")

        updated_notifs = retry_request("GET", NOTIFS_URL, headers=auth_headers(token)).json()
        mark_read_persisted = any(n.get("id") == nid and n.get("read") for n in updated_notifs)
        assert_and_log(mark_read_persisted, "Mark-read persisted correctly.", "Mark-read did not persist or notification not found after update.")
    else:
        logger.info("No notifications to test mark-read functionality.")
    logger.info("Notifications tests completed.")

    # 8) PORTLETS
    logger.info("\n=== TEST: Portlets Endpoints ===")

    # Test GET /api/v1/portlets
    r = retry_request("GET", PORTLETS_URL, headers=auth_headers(token))
    assert_and_log(r.status_code == 200, "GET /api/v1/portlets returned 200 OK.", f"GET /api/v1/portlets failed: Status {r.status_code}, Response: {r.text}")
    portlets_list = r.json()
    assert_and_log(isinstance(portlets_list, list), "GET /api/v1/portlets returned a list.", f"GET /api/v1/portlets did not return a list: {portlets_list}")
    logger.info(f"Successfully retrieved {len(portlets_list)} portlets.")

    # Test POST /api/v1/portlets
    new_portlet_payload = {
        "key": f"test-portlet-{int(time.time())}",
        "title": "Automated Test Portlet",
        "category": "Test Category",
        "description": "This is a portlet created by the automated test script.",
        "enabled": True,
        "order": 100,
        "settings": {
            "displayMode": "compact",
            "dataRefreshRateSec": 60,
            "filters": ["region", "status"],
            "nested": {
                "subKey": "subValue",
                "numbers": [1, 2, 3]
            }
        }
    }
    r = retry_request("POST", PORTLETS_URL, headers=auth_headers(token), json=new_portlet_payload)
    assert_and_log(r.status_code == 201, "POST /api/v1/portlets returned 201 Created.", f"POST /api/v1/portlets failed: Status {r.status_code}, Response: {r.text}")
    created_portlet = r.json()
    assert_and_log(created_portlet.get("id") is not None, "Created portlet has an 'id'.", "Created portlet missing 'id'.")
    assert_and_log(created_portlet.get("key") == new_portlet_payload["key"], "Created portlet key matches.", f"Created portlet key mismatch: Expected '{new_portlet_payload['key']}', Got '{created_portlet.get('key')}'")
    assert_and_log(created_portlet.get("title") == new_portlet_payload["title"], "Created portlet title matches.", f"Created portlet title mismatch: Expected '{new_portlet_payload['title']}', Got '{created_portlet.get('title')}'")
    assert_and_log(created_portlet.get("settings") == new_portlet_payload["settings"], "Created portlet settings match.", f"Created portlet settings mismatch: Expected '{new_portlet_payload['settings']}', Got '{created_portlet.get('settings')}'")
    logger.info(f"Successfully created portlet: {created_portlet.get('title')} (ID: {created_portlet.get('id')})")
    logger.info("Portlets tests completed.")

    logger.info("\n=======================================")
    if FAILED_TEST_COUNT == 0:
        logger.info(" All API tests passed successfully!")
    else:
        logger.error(f" {FAILED_TEST_COUNT} test(s) failed.")
        sys.exit(1)
    logger.info("=======================================")

if __name__ == "__main__":
    main()
