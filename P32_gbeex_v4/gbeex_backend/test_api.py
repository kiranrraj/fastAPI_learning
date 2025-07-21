#!/usr/bin/env python3
import os
import sys
import logging
import requests
from time import sleep

# ——— Configuration ———
BASE_URL      = os.getenv("GBEEX_BASE_URL", "http://127.0.0.1:8100")
LOGIN_URL     = BASE_URL + "/api/v1/auth/login"
ME_URL        = BASE_URL + "/api/v1/users/me"
COMPANIES_URL = BASE_URL + "/api/v1/companies"
NOTIFS_URL    = BASE_URL + "/api/v1/notifications"

USERNAME = "KiranRaj008351"
PASSWORD = USERNAME

# ——— Logging Setup ———
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("test_api")

def retry_request(method, url, **kwargs):
    """Try up to 3 times, with a short back‑off."""
    for attempt in range(1, 4):
        logger.info(f"→ REQUEST {method} {url} (attempt {attempt})")
        if "headers" in kwargs:
            logger.info(f"  headers: {kwargs['headers']}")
        if "data" in kwargs:
            logger.info(f"  data: {kwargs['data']}")
        if "json" in kwargs:
            logger.info(f"  json: {kwargs['json']}")
        try:
            resp = requests.request(method, url, timeout=5, **kwargs)
            logger.info(f"← RESPONSE {resp.status_code}")
            logger.info(f"  body: {resp.text}")
            return resp
        except requests.RequestException as e:
            logger.warning(f"REQUEST failed: {e}")
            if attempt < 3:
                sleep(1)
            else:
                logger.error("Giving up after 3 attempts.")
                sys.exit(1)

def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}

def fail(msg):
    logger.error(msg)
    sys.exit(1)

def main():
    # 1) LOGIN
    logger.info("=== START login ===")
    r = retry_request("POST", LOGIN_URL, data={"username": USERNAME, "password": PASSWORD})
    if r.status_code != 200:
        fail(f"Login failed: {r.status_code} {r.text}")
    token = r.json().get("access_token") or fail("No access_token in login")
    logger.info("=== END login ===\n")

    # 2) ROOT & HEALTH
    logger.info("=== START test_root_and_health ===")
    r = retry_request("GET", BASE_URL + "/")
    if r.status_code != 200: fail(f"Root returned {r.status_code}")
    r = retry_request("GET", BASE_URL + "/health")
    if r.status_code != 200 or r.json().get("status") != "ok":
        fail(f"Health check failed: {r.status_code} {r.text}")
    logger.info("=== END test_root_and_health ===\n")

    # 3) INVALID LOGIN
    logger.info("=== START test_login_invalid ===")
    r = retry_request("POST", LOGIN_URL, data={"username":"wrong","password":"wrong"})
    if r.status_code != 401: fail(f"Wrong creds gave {r.status_code}")
    logger.info("=== END test_login_invalid ===\n")

    # 4) /users/me
    logger.info("=== START test_me ===")
    r = retry_request("GET", ME_URL, headers=auth_headers(token))
    if r.status_code != 200: fail(f"/users/me {r.status_code}")
    if r.json().get("username") != USERNAME:
        fail(f"Expected username={USERNAME}, got {r.json()}")
    logger.info("=== END test_me ===\n")

    # 5) companies list & detail
    logger.info("=== START test_companies ===")
    r = retry_request("GET", COMPANIES_URL, headers=auth_headers(token))
    if r.status_code != 200: fail(f"/companies {r.status_code}")
    comps = r.json()
    if not isinstance(comps, list) or not comps:
        fail(f"Bad companies list: {comps}")
    cid = comps[0].get("companyId") or fail("First company missing companyId")
    r = retry_request("GET", f"{COMPANIES_URL}/{cid}", headers=auth_headers(token))
    if r.status_code != 200: fail(f"/companies/{cid} {r.status_code}")
    if r.json().get("companyId") != cid:
        fail(f"Company detail mismatch: {r.json()}")
    logger.info("=== END test_companies ===\n")

    # 6) protocols & sites
    logger.info("=== START test_protocols_and_sites ===")
    r = retry_request("GET", f"{COMPANIES_URL}/{cid}/protocols", headers=auth_headers(token))
    if r.status_code != 200: fail(f"/protocols list {r.status_code}")
    prots = r.json()
    if not prots: fail("No protocols")
    pid = prots[0].get("protocolId") or fail("Protocol missing protocolId")
    r = retry_request("GET", f"{BASE_URL}/api/v1/protocols/{pid}/sites", headers=auth_headers(token))
    if r.status_code != 200: fail(f"/sites {r.status_code}")
    if not r.json(): fail("No sites returned")
    logger.info("=== END test_protocols_and_sites ===\n")

    # 7) notifications & mark‑read
    logger.info("=== START test_notifications ===")
    r = retry_request("GET", NOTIFS_URL, headers=auth_headers(token))
    if r.status_code != 200: fail(f"/notifications {r.status_code}")
    notifs = r.json()
    if not isinstance(notifs, list): fail("Notifications not a list")
    if notifs:
        nid = notifs[0].get("id") or fail("Notification missing id")
        r = retry_request("POST", f"{NOTIFS_URL}/{nid}/read", headers=auth_headers(token))
        if r.status_code != 200 or r.json().get("status") != "ok":
            fail(f"Mark‑read failed: {r.status_code} {r.text}")
        updated = retry_request("GET", NOTIFS_URL, headers=auth_headers(token)).json()
        if not any(n.get("id")==nid and n.get("read") for n in updated):
            fail("Mark‑read did not persist")
    logger.info("=== END test_notifications ===\n")

    logger.info(" All tests passed!")
    sys.exit(0)

if __name__ == "__main__":
    main()
