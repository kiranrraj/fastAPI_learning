import asyncio
import httpx
import json

BASE_URL = "http://localhost:8010"
LOGIN_ENDPOINT = "/auth/login"
DATA_ENDPOINT = "/data/"

# Replace these test credentials with real MongoDB ones
TEST_USER = {
    "email": "kiran.raj@gmail.com",
    "password": "admin@1234@A"
}

payload = {
    "params": [
        {
            "include_children": True,
            "limit": 10,
            "skip": 0
        }
    ]
}

async def run_test():
    print(f"[Auth] Logging in as {TEST_USER['email']}...")

    async with httpx.AsyncClient(timeout=10.0) as client:
        # Step 1: Login
        login_resp = await client.post(f"{BASE_URL}{LOGIN_ENDPOINT}", json=TEST_USER)

        if login_resp.status_code != 200:
            print(f" Login failed: {login_resp.status_code} - {login_resp.text}")
            return

        token = login_resp.json().get("access_token")
        if not token:
            print(" Login response did not contain access_token.")
            return

        print(" Login successful. Token acquired.\n")

        # Use token for RBAC-protected request
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        print("[Test] Requesting /data/ with RBAC filtering...\n")
        data_resp = await client.post(f"{BASE_URL}{DATA_ENDPOINT}", headers=headers, json=payload)

        print(" Status Code:", data_resp.status_code)

        try:
            data = data_resp.json()
            if isinstance(data, dict) and "detail" in data:
                print("  Error from API:", data["detail"])
                return

            print(f"  Received {len(data)} group(s):")
            for group in data:
                inv_count = len(group.get("investigations", []))
                print(f" - {group['name']} ({inv_count} items)")
        except Exception as e:
            print("  Failed to parse JSON:", str(e))
            print("Raw Response:", data_resp.text)

if __name__ == "__main__":
    asyncio.run(run_test())
