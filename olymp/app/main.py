from fastapi import FastAPI

from .router import resources

app = FastAPI()


@app.get("/")
def get_status():
    """
    Get status of Olymp.
    """
    return {"status": "Olymp is Up 💚"}


app.include_router(resources.router)
