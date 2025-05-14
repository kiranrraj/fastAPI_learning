from fastapi import FastAPI, HTTPException, Header

token_store={}

def get_token_header(x_token: str = Header(...)):
    if x_token not in token_store:
        raise HTTPException(status_code=403, detail="Unauthorized Token")
    return x_token

def register_token(username: str, token: str):
    token_store[token] = username