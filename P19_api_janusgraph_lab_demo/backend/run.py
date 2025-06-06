import uvicorn
import os
import sys

def main():
    # Default to 'dev' if no argument is given
    env = sys.argv[1] if len(sys.argv) > 1 else "dev"

    # Mapping to correct .env files
    env_file_map = {
        "dev": ".env.dev",
        "test": ".env.test",
        "prod": ".env.prod",
    }

    selected_env_file = env_file_map.get(env.lower(), ".env.dev")

    # Set environment variable for config loader
    os.environ["ENV_FILE"] = selected_env_file
    print(f"[INFO] Running with environment: {env.upper()} ({selected_env_file})")

    uvicorn.run("app.main:app", host="127.0.0.1", port=8001, reload=True)

if __name__ == "__main__":
    main()
