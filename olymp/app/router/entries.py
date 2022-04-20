"""Imports"""
from datetime import datetime
from typing import List
from uuid import UUID, uuid4

from app.model.entry import EntryIn, EntryOut
from app.model.state import State
from app.storage import crud, schema
from app.storage.database import SessionLocal, engine
from app.storage.db import FakeDatabase, get_fake_db
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

schema.Base.metadata.create_all(bind=engine)


router = APIRouter(
    prefix="/resources/{resource_uuid}/entries",
    tags=["entries"],
    responses={404: {"description": "Not found"}},
)


def get_db():
    """Get an independent database session per request."""
    database = SessionLocal()
    try:
        yield database
    finally:
        database.close()


@router.get("/", response_model=List[EntryOut])
def read_entries(resource_uuid: UUID, database: Session = Depends(get_db)):
    """Retrieve all entries of a specific resource."""
    try:
        return crud.get_entries(database, resource_uuid)
    except BaseException as err:
        raise HTTPException(status_code=404, detail=str(err)) from err


@router.post("/", response_model=EntryOut, status_code=status.HTTP_201_CREATED)
def create_entry(
    resource_uuid: UUID, entry: EntryIn, database: Session = Depends(get_db)
):
    """Create a new entry."""
    now = datetime.now()
    new_entry = EntryOut(
        entry_uuid=uuid4(),
        public_body=entry.public_body,
        private_body=entry.private_body,
        created=now,
        updated=now,
        state=State.ACTIVE,
    )
    try:
        return crud.create_entry(database, resource_uuid, new_entry)
    except BaseException as err:
        raise HTTPException(status_code=404, detail=str(err)) from err


@router.get("/{entry_uuid}/", response_model=EntryOut)
def read_entry(
    resource_uuid: UUID, entry_uuid: UUID, database: FakeDatabase = Depends(get_fake_db)
):
    """Retrive one entry."""
    try:
        return database.entry_by_id(resource_uuid, entry_uuid)
    except BaseException as err:
        raise HTTPException(status_code=404, detail=str(err)) from err


@router.put("/{entry_uuid}/", response_model=EntryOut)
def update_entry(
    resource_uuid: UUID,
    entry_uuid: UUID,
    entry: EntryIn,
    database: FakeDatabase = Depends(get_fake_db),
):
    """Update an existing entry."""
    try:
        return database.update_entry(resource_uuid, entry_uuid, entry)
    except BaseException as err:
        raise HTTPException(status_code=404, detail=str(err)) from err


@router.delete("/{entry_uuid}/", response_model=EntryOut)
def deactivate_entry(
    resource_uuid: UUID, entry_uuid: UUID, database: FakeDatabase = Depends(get_fake_db)
):
    """Deactivates a entry (does not delete it)."""
    try:
        return database.deactivate_entry(resource_uuid, entry_uuid)
    except BaseException as err:
        raise HTTPException(status_code=404, detail=str(err)) from err
