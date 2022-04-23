"""Imports"""
from datetime import datetime
from uuid import UUID, uuid4

from app.model.entry import EntryIn, EntryOut
from app.model.state import State
from app.storage import crud, schema
from app.storage.database import SessionLocal, engine
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


@router.get("/", response_model=list[EntryOut])
def read_entries(
    resource_uuid: UUID, state: State | None = None, database: Session = Depends(get_db)
):
    """
    Retrieve all entries of a specific resource. Use the `state` query to filter only "active" or "inactive" entries.
    """
    if state is None:
        try:
            return crud.get_entries(database, resource_uuid)
        except BaseException as err:
            raise HTTPException(status_code=404, detail=str(err)) from err
    try:
        return crud.get_entries_by_state(database, resource_uuid, state=state)
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
        snapshot_uuid=uuid4(),
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
    resource_uuid: UUID, entry_uuid: UUID, database: Session = Depends(get_db)
):
    """Retrive one entry."""
    try:
        db_entry = crud.get_entry(database, resource_uuid, entry_uuid)
    except BaseException as err:
        raise HTTPException(status_code=404, detail=str(err)) from err
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    return db_entry


@router.put("/{entry_uuid}/", response_model=EntryOut)
def update_entry(
    resource_uuid: UUID,
    entry_uuid: UUID,
    entry: EntryIn,
    database: Session = Depends(get_db),
):
    """Update an existing entry."""
    now = datetime.now()
    try:
        db_entry = crud.update_entry(database, resource_uuid, entry_uuid, entry, now)
    except BaseException as err:
        raise HTTPException(status_code=404, detail=str(err)) from err
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    return db_entry


@router.delete("/{entry_uuid}/", response_model=EntryOut)
def deactivate_entry(
    resource_uuid: UUID, entry_uuid: UUID, database: Session = Depends(get_db)
):
    """Deactivates an entry (does not delete it)."""
    now = datetime.now()
    try:
        db_entry = crud.deactivate_entry(database, resource_uuid, entry_uuid, now)
    except BaseException as err:
        raise HTTPException(status_code=404, detail=str(err)) from err
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    return db_entry
