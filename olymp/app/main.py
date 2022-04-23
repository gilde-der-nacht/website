"""Imports"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.router import entries, resources, snapshots

app = FastAPI(
    title="Olymp API",
    contact={"name": "Gilde der Nacht", "url": "https://gildedernacht.ch/kontakt"},
)

origins = [
    "https://gildedernacht.ch/",
    "https://spieltage.ch/",
    "https://rollenspieltage.ch/",
    "https://tabletoptage.ch/",
    "https://admin.gdn.lvl8.io/",
    "https://admin.olymp.gildedernacht.ch/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def get_status():
    """
    Get status of Olymp.
    """
    return {"status": "Olymp is Up 💚"}


app.include_router(resources.router)
app.include_router(entries.router)
app.include_router(snapshots.router)
