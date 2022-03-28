from fastapi import FastAPI

from app.router import resources

app = FastAPI(
    title="Olymp",
    contact={
        "name": "Gilde der Nacht",
        "url": "https://gildedernacht.ch/kontakt"
    }
)


@app.get("/")
def get_status():
    """
    Get status of Olymp.
    """
    return {"status": "Olymp is Up 💚"}


app.include_router(resources.router)
