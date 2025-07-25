from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from routes.search import router as search_data_router
from routes.search_meta import router as search_meta_router

app = FastAPI(title="GBeeX API", version="1.0.0")

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,  
    allow_methods=["*"], 
    allow_headers=["*"],
)

app.include_router(search_data_router)
app.include_router(search_meta_router)
