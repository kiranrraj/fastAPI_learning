import uvicorn

# "app.main:app" tells uvicorn to look in the app/main.py 
# file and find the app FastAPI instance.
# reload=True allows auto-reload during development.

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8001, reload=True)