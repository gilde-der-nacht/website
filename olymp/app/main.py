from fastapi import FastAPI

from .router import resources

app = FastAPI()


@app.get("/")
def read_root():
    return {"status": "Olymp is Up 💚"}


app.include_router(resources.router)
