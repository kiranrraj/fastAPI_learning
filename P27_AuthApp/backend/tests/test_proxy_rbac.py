import asyncio
import httpx
import json

BASE_URL = "http://localhost:8010"
ENDPOINT = "/data/"
TOKEN = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbjEyMzQiLCJleHAiOjE3NTA5OTcyOTF9.NvWtCTT0cUgyrSoUO3Egs72KrLPCs6tlQx9bWYO8-Qs"
)

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# Optional params to forward to Janus — you can change these as needed
payload = {
    "params": [
        {
            "include_children": True,
            "limit": 10,
            "skip": 0
        }
    ]
}

async def test_proxy_data():
    print("[Test] Starting request to proxy endpoint...\n")

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{BASE_URL}{ENDPOINT}",
                headers=headers,
                json=payload  # You may also test with json={} or json=None
            )

            print(" Status Code:", response.status_code)

            # Attempt to decode response
            try:
                json_data = response.json()
                print(f" Response JSON ({len(json_data)} items):")
                print(json.dumps(json_data, indent=2))
            except ValueError:
                print(" Response is not valid JSON.")
                print("Raw Text:", response.text)

            if response.status_code >= 400:
                print("\n  Error Response Headers:", dict(response.headers))
                print("  Error Response Body:", response.text)

    except httpx.RequestError as e:
        print(f"[RequestError] Network-level exception: {str(e)}")
    except httpx.TimeoutException:
        print("[Timeout] Request exceeded the timeout limit.")
    except Exception as e:
        print(f"[Unhandled Exception] {type(e).__name__}: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_proxy_data())
