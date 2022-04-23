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
    prefix="/resources/{resource_uuid}/snapshots",
    tags=["snapshots"],
    responses={404: {"description": "Not found"}},
)


def get_db():
    """Get an independent database session per request."""
    database = SessionLocal()
    try:
        yield database
    finally:
        database.close()


@router.post("/", response_model=EntryOut, status_code=status.HTTP_201_CREATED)
def create_entry(
    resource_uuid: UUID, entry: EntryIn, database: Session = Depends(get_db)
):
    """
    Create a new entry.
    Behaves exactly the same as the `POST:/resources/{resource_uuid}/entries/` endpoint.
    """
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
