from fastapi import FastAPI
import uvicorn

# creating an instance of the FastAPI class and assigning it to the variable app. 
# This app object will be the central point for defining your API endpoints,
#  middleware, and other configurations.
app = FastAPI()

# decorator that registers a function to handle HTTP GET requests to a specific path.
@app.get("/")

# function that will be executed when a GET request is made to the '/' path.
def handle_root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8010, reload=True)

    # function to start the FastAPI application. Let's break down the arguments:
    # "main:app": This tells Uvicorn where to find your FastAPI application. 
    # Assumes your Python file is named main.py and that your FastAPI instance is named app. 
    # The format is "module_name:app_instance_name".

    # host="127.0.0.1": This specifies the network interface that the server will listen on. 
    # port=8010: This sets the port number on which the server will listen for incoming requests. 
    # reload=True: When set to True, Uvicorn will automatically restart the server whenever you make changes to your code.