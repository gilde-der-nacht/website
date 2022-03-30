from typing import List
from uuid import UUID

from app.model.entry import EntryIn, EntryOut
from app.storage.db import FakeDatabase, get_fake_db
from fastapi import APIRouter, Depends, HTTPException, status

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
    try:
        return db.entries_by_resource_id(resource_uuid)
    except BaseException as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/", response_model=UUID, status_code=status.HTTP_201_CREATED)
def create_entry(
    resource_uuid: UUID, entry: EntryIn, db: FakeDatabase = Depends(get_fake_db)
):
    """
    Create a new entry.
    """
    try:
        return db.create_entry(resource_uuid, entry)
    except BaseException as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{entry_uuid}/", response_model=EntryOut)
def read_entry(
    resource_uuid: UUID, entry_uuid: UUID, db: FakeDatabase = Depends(get_fake_db)
):
    """
    Retrive one entry.
    """
    try:
        return db.entry_by_id(resource_uuid, entry_uuid)
    except BaseException as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{entry_uuid}/", response_model=EntryOut)
def update_entry(
    resource_uuid: UUID,
    entry_uuid: UUID,
    entry: EntryIn,
    db: FakeDatabase = Depends(get_fake_db),
):
    """
    Update an existing entry.
    """
    try:
        return db.update_entry(resource_uuid, entry_uuid, entry)
    except BaseException as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{entry_uuid}/", response_model=EntryOut)
def deactivate_entry(
    resource_uuid: UUID, entry_uuid: UUID, db: FakeDatabase = Depends(get_fake_db)
):
    """
    Deactivates a entry (does not delete it).
    """
    try:
        return db.deactivate_entry(resource_uuid, entry_uuid)
    except BaseException as e:
        raise HTTPException(status_code=404, detail=str(e))
