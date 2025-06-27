# test_auth_user_flow.py

import httpx
import asyncio
import datetime

# Base URLs
BACKEND_URL = "http://localhost:8010"
FRONTEND_URL = "http://localhost:3000"

# Test credentials
TEST_USER = {
    "email": "kiran.raj@gmail.com",
    "password": "admin@1234@A"
}


def now():
    return datetime.datetime.now().strftime("[%H:%M:%S]")


async def test_health_and_root():
    async with httpx.AsyncClient() as client:
        print(f"{now()} Testing public endpoints...")

        endpoints = [
            (f"{BACKEND_URL}/", "Backend root"),
            (f"{BACKEND_URL}/users/health", "Backend /users/health"),
            (f"{BACKEND_URL}/users/spec", "Backend /users/spec"),
            (f"{FRONTEND_URL}/", "Frontend root"),
        ]

        for url, label in endpoints:
            try:
                res = await client.get(url)
                print(f"{now()} {label} => {res.status_code}")
            except Exception as e:
                print(f"{now()} {label} ERROR: {e}")


async def test_auth_flow():
    async with httpx.AsyncClient(follow_redirects=True) as client:
        print(f"\n{now()}  Logging in...")

        # Login
        login_res = await client.post(f"{BACKEND_URL}/auth/login", json=TEST_USER)
        print(f"{now()} /auth/login => {login_res.status_code}")
        if login_res.status_code != 200:
            print(f"{now()}  Login failed: {login_res.text}")
            return

        login_data = login_res.json()
        access_token = login_data.get("access_token")
        refresh_token = login_data.get("refresh_token")

        if not access_token:
            print(f"{now()}  No access token received.")
            return

        print(f"{now()}  Logged in. Access token received.")

        # /users/me with token
        headers = {"Authorization": f"Bearer {access_token}"}
        me_res = await client.get(f"{BACKEND_URL}/users/me", headers=headers)
        print(f"{now()} /users/me => {me_res.status_code}")
        if me_res.status_code == 200:
            print(f"{now()}  Current user: {me_res.json()}")
        else:
            print(f"{now()}  Failed to fetch user profile.")

        # Refresh token
        print(f"{now()}  Refreshing token...")
        refresh_res = await client.post(f"{BACKEND_URL}/auth/refresh", cookies={"refresh_token": refresh_token})
        print(f"{now()} /auth/refresh => {refresh_res.status_code}")
        if refresh_res.status_code == 200:
            print(f"{now()}  Token refreshed.")
        else:
            print(f"{now()}  Token refresh failed: {refresh_res.text}")

        # 4. Logout
        print(f"{now()}  Logging out...")
        logout_res = await client.post(f"{BACKEND_URL}/auth/logout", cookies={"refresh_token": refresh_token})
        print(f"{now()} /auth/logout => {logout_res.status_code}")
        if logout_res.status_code == 200:
            print(f"{now()}  Logged out successfully.")
        else:
            print(f"{now()}  Logout failed: {logout_res.text}")


async def main():
    print(f"{now()}  Starting full test suite...\n")
    await test_health_and_root()
    await test_auth_flow()
    print(f"\n{now()}  All tests complete.\n")


if __name__ == "__main__":
    asyncio.run(main())
