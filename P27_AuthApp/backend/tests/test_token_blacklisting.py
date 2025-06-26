import requests

BASE_URL = "http://localhost:8010"

LOGIN_URL = f"{BASE_URL}/auth/login"
REFRESH_URL = f"{BASE_URL}/auth/refresh"
LOGOUT_URL = f"{BASE_URL}/auth/logout"

EMAIL = "kiranraj_r@gmail.com" 
PASSWORD = "admin@ABC@000"  

def test_token_blacklisting():
    session = requests.Session()

    print(" Logging in...")
    login_resp = session.post(LOGIN_URL, json={"email": EMAIL, "password": PASSWORD})
    print("Login response:", login_resp.status_code, login_resp.text)
    assert login_resp.status_code == 200
    data = login_resp.json()
    access_token = data["access_token"]
    refresh_token = data["refresh_token"]
    print(" Access token received.")
    print("Setting refresh token cookie...")
    session.cookies.set("refresh_token", refresh_token)

    print(" Refreshing token...")
    refresh_resp = session.post(REFRESH_URL, json={})
    print("Refresh response:", refresh_resp.status_code, refresh_resp.text)
    assert refresh_resp.status_code == 200
    print(" Token refreshed successfully.")

    print(" Logging out ...")
    logout_resp = session.post(LOGOUT_URL)
    assert logout_resp.status_code == 200
    print(" Logged out and refresh token deleted.")

    print(" Trying to refresh again ...")
    refresh_resp = session.post(REFRESH_URL, json={})
    assert refresh_resp.status_code == 401
    print(" Refresh failed due to token blacklist.")
    print("Testing completed.")

if __name__ == "__main__":
    test_token_blacklisting()
