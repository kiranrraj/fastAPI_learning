import httpx
import asyncio

BASE_URL = "http://localhost:8001"
EMAIL = "kiran.raj@gmail.com"
PASSWORD = "admin@1234@A"

async def run_tests():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        print("Logging in...")
        login_res = await client.post("/auth/login", json={
            "email": EMAIL,
            "password": PASSWORD
        })
        if login_res.status_code != 200:
            print("Login failed:", login_res.text)
            return

        tokens = login_res.json()
        access_token = tokens["access_token"]
        headers = {"Authorization": f"Bearer {access_token}"}
        cookies = {"refresh_token": tokens["refresh_token"]}

        print("Login successful.")

        print("Testing /auth/me...")
        me_res = await client.get("/auth/me", headers=headers)
        print("Status:", me_res.status_code)
        print("Response:", me_res.json())

        print("Testing /auth/refresh...")
        refresh_res = await client.post("/auth/refresh", cookies=cookies)
        print("Status:", refresh_res.status_code)
        print("Response:", refresh_res.json())

        print("Testing /notifications/...")
        notif_res = await client.get("/notifications/", headers=headers)
        print("Status:", notif_res.status_code)
        print("Response:", notif_res.json())

        notifications = notif_res.json()
        if notifications:
            notif_id = notifications[0]["id"]
            print(f"Found notification ID: {notif_id}")

            print("Marking as read...")
            read_res = await client.patch(f"/notifications/{notif_id}/read", headers=headers)
            print("Status:", read_res.status_code)
            print("Response:", read_res.json())

            print("Deleting notification...")
            delete_res = await client.delete(f"/notifications/{notif_id}", headers=headers)
            print("Status:", delete_res.status_code)
            print("Response:", delete_res.json())
        else:
            print("No notifications to mark or delete.")

        print("Logging out...")
        logout_res = await client.post("/auth/logout", cookies=cookies)
        print("Status:", logout_res.status_code)
        print("Response:", logout_res.json())

# Call the async test runner in script context
if __name__ == "__main__":
    asyncio.run(run_tests())
