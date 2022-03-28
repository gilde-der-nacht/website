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
    prefix="/resources/{resource_uuid}/entries",
    tags=["entries"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[EntryOut])
def read_entries(resource_uuid: UUID, db: FakeDatabase = Depends(get_fake_db)):
    """
    Retrieve all entries of a specific resource.
    """
    return db.entries_by_resource_id(resource_uuid)


@router.post("/", response_model=UUID, status_code=status.HTTP_201_CREATED)
def create_entry(resource_uuid: UUID, entry: EntryIn, db: FakeDatabase = Depends(get_fake_db)):
    """
    Create a new entry.
    """
    return db.create_entry(resource_uuid, jsonable_encoder(entry))


@router.get("/{entry_uuid}/", response_model=EntryOut)
def read_entry(resource_uuid: UUID, entry_uuid: UUID, db: FakeDatabase = Depends(get_fake_db)):
    """
    Retrive one entry.
    """
    return db.entry_by_id(resource_uuid, entry_uuid)


@router.put("/{entry_uuid}/", response_model=EntryOut)
def update_entry(resource_uuid: UUID, entry_uuid: UUID, entry: EntryIn, db: FakeDatabase = Depends(get_fake_db)):
    """
    Update an existing entry.
    """
    return db.update_resource(resource_uuid, entry_uuid, jsonable_encoder(entry))


@router.delete("/{entry_uuid}/", response_model=EntryOut)
def deactivate_entry(resource_uuid: UUID, entry_uuid: UUID, db: FakeDatabase = Depends(get_fake_db)):
    """
    Deactivates a entry (does not delete it).
    """
    return db.deactivate_entry(resource_uuid, entry_uuid)
