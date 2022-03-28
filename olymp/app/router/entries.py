from datetime import datetime
from typing import List
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.encoders import jsonable_encoder


from app.model.entry import EntryOut, EntryIn
from app.model.status import Status
from app.storage.db import FakeDatabase, get_fake_db

router = APIRouter(
    prefix="/resources/{r_uuid}/entries",
    tags=["entries"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[EntryOut])
def read_entries(r_uuid: UUID, db: FakeDatabase = Depends(get_fake_db)):
    """
    Retrieve all entries of a specific resource.
    """
    r = db.resource_by_id(r_uuid)
    if not r:
        raise HTTPException(status_code=404, detail="Resource not found")
    return r.get("entries")


@router.post("/", response_model=UUID, status_code=status.HTTP_201_CREATED)
def create_entry(r_uuid: UUID, entry: EntryIn, db: FakeDatabase = Depends(get_fake_db)):
    """
    Create a new entry.
    """
    now = datetime.now()
    new_entry = {
        **jsonable_encoder(entry),
        "uuid": uuid4(),
        "created": now,
        "updated": now,
        "status": Status.active,
    }
    r = db.resource_by_id(r_uuid)
    if not r:
        raise HTTPException(status_code=404, detail="Resource not found")
    r.get("entries").append(new_entry)
    return new_entry.get("uuid")
