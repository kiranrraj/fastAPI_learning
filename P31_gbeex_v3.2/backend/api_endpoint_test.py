# test_api.py
# A script to test the GBeeX FastAPI endpoints with detailed logging,
# including account lockout functionality.
# To run:
# 1. Make sure your FastAPI server is running (uvicorn main:app --reload)
# 2. Run this script in a separate terminal: python test_api.py
# 3. Prerequisite: pip install requests

import requests
import json
import logging
from datetime import datetime

# --- Configuration ---
BASE_URL = "http://127.0.0.1:8000"
LOG_FILE = "api_test_log.log"

# --- Test Credentials ---
# User for general tests
VALID_USERNAME = "admin01"
VALID_PASSWORD = "admin01"

# User specifically for lockout tests
LOCKOUT_TEST_USERNAME = "tester01"
LOCKOUT_TEST_PASSWORD = "tester01"
INVALID_PASSWORD = "wrongpassword"

# --- Logging Setup ---
# NOTE: If 'api_test_log.log' is not created, check folder permissions.
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename=LOG_FILE,
    filemode='w'
)
console_log = logging.getLogger('console')
console_log.setLevel(logging.INFO)
console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter('%(message)s'))
console_log.addHandler(console_handler)
console_log.propagate = False

def log_test_header(title):
    header = "\n" + "="*50 + f"\n  TESTING: {title}\n" + "="*50
    logging.info(header)
    console_log.info(header)

def log_response_details_to_file(response):
    logging.info(f"Status Code: {response.status_code}")
    try:
        logging.info("Response JSON:")
        logging.info(json.dumps(response.json(), indent=2))
    except json.JSONDecodeError:
        logging.info("Response Body (not JSON):")
        logging.info(response.text)

def main():
    test_results = []
    access_token = None
    
    start_time = datetime.now()
    start_message = f"API TEST SUITE STARTED AT: {start_time.strftime('%Y-%m-%d %H:%M:%S')}"
    logging.info(start_message)
    console_log.info(start_message)
    
    # --- 1. Standard API Flow Tests ---
    log_test_header("Standard API Flow")
    
    test_name = "Login with Valid Credentials (admin01)"
    console_log.info(f"\n--- Sub-test: {test_name} ---")
    logging.info(f"--- Sub-test: {test_name} ---")
    try:
        r_valid = requests.post(f"{BASE_URL}/api/v1/auth/login", data={'username': VALID_USERNAME, 'password': VALID_PASSWORD})
        log_response_details_to_file(r_valid)
        assert r_valid.status_code == 200
        access_token = r_valid.json().get("access_token")
        assert access_token is not None
        console_log.info("--> RESULT: SUCCESS")
        test_results.append({"name": test_name, "status": "SUCCESS"})
    except Exception as e:
        console_log.error(f"--> RESULT: FAILED")
        logging.error(f"Test '{test_name}' FAILED with exception: {e}")
        test_results.append({"name": test_name, "status": "FAILED", "reason": str(e)})
        access_token = None

    if access_token:
        headers = {"Authorization": f"Bearer {access_token}"}
        test_name = "Get Current User: GET /api/v1/users/me"
        log_test_header(test_name)
        try:
            r = requests.get(f"{BASE_URL}/api/v1/users/me", headers=headers)
            log_response_details_to_file(r)
            assert r.status_code == 200
            console_log.info("--> RESULT: SUCCESS")
            test_results.append({"name": test_name, "status": "SUCCESS"})
        except Exception as e:
            console_log.error(f"--> RESULT: FAILED")
            logging.error(f"Test '{test_name}' FAILED with exception: {e}")
            test_results.append({"name": test_name, "status": "FAILED", "reason": str(e)})
    else:
        console_log.error("\nCould not log in admin user. Skipping standard API flow tests.")

    # --- 2. Account Lockout and Security Tests ---
    log_test_header("Account Lockout Security Flow")
    
    test_name = "Pre-test: Reset Lockout User State"
    console_log.info(f"\n--- Sub-test: {test_name} ---")
    logging.info(f"--- Sub-test: {test_name} ---")
    reset_succeeded = False
    try:
        r_reset = requests.post(f"{BASE_URL}/api/v1/auth/login", data={'username': LOCKOUT_TEST_USERNAME, 'password': LOCKOUT_TEST_PASSWORD})
        log_response_details_to_file(r_reset)
        assert r_reset.status_code == 200
        console_log.info("--> RESULT: SUCCESS (User state reset)")
        test_results.append({"name": test_name, "status": "SUCCESS"})
        reset_succeeded = True
    except Exception as e:
        console_log.error(f"--> RESULT: FAILED")
        logging.error(f"Test '{test_name}' FAILED with exception: {e}")
        test_results.append({"name": test_name, "status": "FAILED", "reason": str(e)})

    if reset_succeeded:
        max_attempts = 5
        test_name = f"Simulate {max_attempts} Failed Login Attempts"
        console_log.info(f"\n--- Sub-test: {test_name} ---")
        logging.info(f"--- Sub-test: {test_name} ---")
        lockout_test_passed = True
        for i in range(max_attempts):
            try:
                console_log.info(f"Attempt {i+1}/{max_attempts}...")
                r_fail = requests.post(f"{BASE_URL}/api/v1/auth/login", data={'username': LOCKOUT_TEST_USERNAME, 'password': INVALID_PASSWORD})
                log_response_details_to_file(r_fail)
                if i < max_attempts - 1:
                    assert r_fail.status_code == 401
                else:
                    assert r_fail.status_code == 403
            except AssertionError:
                lockout_test_passed = False
                console_log.error(f"--> ATTEMPT {i+1} FAILED: Unexpected status code {r_fail.status_code}")
                logging.error(f"Test '{test_name}' FAILED on attempt {i+1} with status code {r_fail.status_code}")
                test_results.append({"name": f"Failed Attempt {i+1}", "status": "FAILED", "reason": f"Expected 401/403, got {r_fail.status_code}"})
                break
        
        if lockout_test_passed:
            console_log.info("--> RESULT: SUCCESS (All failed attempts behaved as expected)")
            test_results.append({"name": test_name, "status": "SUCCESS"})

        test_name = "Verify Account is Locked"
        console_log.info(f"\n--- Sub-test: {test_name} ---")
        logging.info(f"--- Sub-test: {test_name} ---")
        try:
            r_locked = requests.post(f"{BASE_URL}/api/v1/auth/login", data={'username': LOCKOUT_TEST_USERNAME, 'password': LOCKOUT_TEST_PASSWORD})
            log_response_details_to_file(r_locked)
            assert r_locked.status_code == 403
            console_log.info("--> RESULT: SUCCESS (Account is correctly locked)")
            test_results.append({"name": test_name, "status": "SUCCESS"})
        except Exception as e:
            console_log.error(f"--> RESULT: FAILED")
            logging.error(f"Test '{test_name}' FAILED with exception: {e}")
            test_results.append({"name": test_name, "status": "FAILED", "reason": str(e)})
    else:
        console_log.error("\nCould not reset lockout user state. Skipping lockout flow tests.")


    # --- 3. Final Summary ---
    end_time = datetime.now()
    duration = end_time - start_time
    
    summary_header = "\n" + "#"*50 + "\n  TEST SUMMARY\n" + "#"*50
    logging.info(summary_header)
    console_log.info(summary_header)
    
    success_count = sum(1 for r in test_results if r['status'] == 'SUCCESS')
    failed_count = len(test_results) - success_count
    
    summary_lines = [
        f"Total Tests Run: {len(test_results)}",
        f"Successful: {success_count}",
        f"Failed: {failed_count}"
    ]
    for line in summary_lines:
        logging.info(line)
        console_log.info(line)
    
    if failed_count > 0:
        failed_header = "\n--- FAILED TESTS ---"
        logging.info(failed_header)
        console_log.info(failed_header)
        for result in test_results:
            if result['status'] == 'FAILED':
                failed_line = f"- {result['name']}"
                logging.error(f"{failed_line}: {result.get('reason', 'N/A')}")
                console_log.error(failed_line)

    finish_message = f"\nAPI TEST SUITE FINISHED AT: {end_time.strftime('%Y-%m-%d %H:%M:%S')}"
    duration_message = f"Total Duration: {duration}"
    log_file_message = f"\nFull log available in '{LOG_FILE}'"
    
    logging.info(finish_message)
    console_log.info(finish_message)
    logging.info(duration_message)
    console_log.info(duration_message)
    console_log.info(log_file_message)


if __name__ == "__main__":
    main()
