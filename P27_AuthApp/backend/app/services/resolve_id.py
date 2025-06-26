from bson import ObjectId

def resolve_id(id_str: str):
    # Return ObjectId if valid, else use original string
    try:
        return ObjectId(id_str)
    except Exception:
        return id_str
