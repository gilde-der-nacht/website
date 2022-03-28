from datetime import datetime
from typing import List
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.encoders import jsonable_encoder


from app.model.entry import EntryOut, EntryIn
from app.model.status import Status
from app.storage.db import FakeDatabase, get_fake_db
from app.model.resource import ResourceOut

router = APIRouter(
    prefix="/resources/{r_uuid}/entries",
    tags=["entries"],
    responses={404: {"description": "Not found"}},
)


def get_resource_by_id(r_uuid: UUID, db: FakeDatabase = Depends(get_fake_db)):
    r = db.resource_by_id(r_uuid)
    if not r:
        raise HTTPException(status_code=404, detail="Resource not found")
    return r


@router.get("/", response_model=List[EntryOut])
def read_entries(res: ResourceOut = Depends(get_resource_by_id)):
    """
    Retrieve all entries of a specific resource.
    """
    return res.get("entries")


@router.post("/", response_model=UUID, status_code=status.HTTP_201_CREATED)
def create_entry(entry: EntryIn, res: ResourceOut = Depends(get_resource_by_id)):
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
    res.get("entries").append(new_entry)
    return new_entry.get("uuid")


@router.get("/{e_uuid}", response_model=EntryOut)
def read_entry(e_uuid: UUID, res: ResourceOut = Depends(get_resource_by_id)):
    """
    Retrive one entry.
    """
    e = next((entry for entry in res.get("entries")
              if entry.get("uuid") == e_uuid and entry.get("status") == Status.active), None)
    if not e:
        raise HTTPException(status_code=404, detail="Entry not found")
    return e


@router.put("/{e_uuid}", response_model=EntryOut)
def update_entry(e_uuid: UUID, entry: EntryIn, res: ResourceOut = Depends(get_resource_by_id)):
    """
    Update an existing entry.
    """
    e = next((entry for entry in res.get("entries")
              if entry.get("uuid") == e_uuid and entry.get("status") == Status.active), None)
    if not e:
        raise HTTPException(status_code=404, detail="Entry not found")
    now = datetime.now()
    e.update({**jsonable_encoder(entry), "updated": now})
    return e


@router.delete("/{e_uuid}", response_model=EntryOut)
def deactivate_entry(e_uuid: UUID, res: ResourceOut = Depends(get_resource_by_id)):
    """
    Deactivates a entry (does not delete it).
    """
    e = next((entry for entry in res.get("entries")
              if entry.get("uuid") == e_uuid and entry.get("status") == Status.active), None)
    if not e:
        raise HTTPException(status_code=404, detail="Entry not found")
    e.update({"updated": now, "status": Status.inactive})
    now = datetime.now()
    return e
