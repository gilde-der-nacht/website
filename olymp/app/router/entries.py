from datetime import datetime
from typing import List
from uuid import UUID, uuid4
from fastapi import APIRouter, status
from fastapi.encoders import jsonable_encoder


from app.model.entry import EntryOut, EntryIn
from app.model.status import Status

router = APIRouter(
    prefix="/resources/{r_uuid}/entries",
    tags=["entries"],

)

fake_db = []


@router.get("/")
@router.get("/", response_model=List[EntryOut])
def read_entries(r_uuid: UUID):
    """
    Retrieve all entries of a specific resource.
    """
    return fake_db


@router.post("/", response_model=UUID, status_code=status.HTTP_201_CREATED)
def create_entry(r_uuid: UUID, entry: EntryIn):
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
    fake_db.append(new_entry)
    return new_entry.get("uuid")
