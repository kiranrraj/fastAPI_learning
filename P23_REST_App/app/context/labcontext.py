# app/labcore/context/labcontext.py

class LabContext:
    """
    Minimal implementation of a LabContext.
    You can extend this later to include request-scoped data like user, session, etc.
    """
    def __init__(self, user: str = "anonymous"):
        self.user = user

    def get_user(self) -> str:
        return self.user