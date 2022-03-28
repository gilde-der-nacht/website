from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from datetime import datetime
from uuid import UUID, uuid4
from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

from ..storage.db import FakeDatabase, get_fake_db

router = APIRouter(
    prefix="/resources",
    tags=["resources"],
)


class Status(str, Enum):
    active = "active"
    inactive = "inactive"


class ResourceIn(BaseModel):
    name: str
    description: Optional[str] = ""

    class Config:
        schema_extra = {
            "example": {
                "name": "Name of the new resource",
                "description": "Short description of the resource (optional)"
            }
        }


class ResourceOut(ResourceIn):
    uuid: UUID
    created: datetime
    updated: datetime
    status: Status

    class Config:
        schema_extra = {
            "example": {
                "name": "Resource name",
                "description": "Short description of the resource (can be empty)",
                "uuid": uuid4(),
                "created": datetime.now(),
                "udpated": datetime.now(),
                "status": Status.active
            }
        }


@router.get("/", response_model=List[ResourceOut])
def read_resources(status: Optional[Status] = None, db: FakeDatabase = Depends(get_fake_db)):
    """
    Retrieve all resources. Use the `status` query to filter only "active" or "inactive" resources.
    """
    if not status:
        return db.data
    return db.filtered_data(status)


@router.post("/", response_model=UUID, status_code=status.HTTP_201_CREATED)
def create_resource(resource: ResourceIn, db: FakeDatabase = Depends(get_fake_db)):
    """
    Create a new resource.
    """
    return db.create_resource(jsonable_encoder(resource))


@router.get("/{r_uuid}", response_model=ResourceOut)
def read_resource(r_uuid: UUID, db: FakeDatabase = Depends(get_fake_db)):
    """
    Retrive one resource.
    """
    r = db.resource_by_id(r_uuid)

    if not r:
        raise HTTPException(status_code=404, detail="Resource not found")
    return r


@router.put("/{r_uuid}", response_model=ResourceOut)
def update_resource(r_uuid: UUID, resource: ResourceIn, db: FakeDatabase = Depends(get_fake_db)):
    """
    Update an existing resource.
    """
    r = db.update_resource(r_uuid, jsonable_encoder(resource))

    if not r:
        raise HTTPException(status_code=404, detail="Resource not found")

    return r


@router.delete("/{r_uuid}", response_model=ResourceOut)
def deactivate_resource(r_uuid: UUID, db: FakeDatabase = Depends(get_fake_db)):
    """
    Deactivates a resource (does not delete it).
    """
    r = db.deactivate_resource(r_uuid)

    if not r:
        raise HTTPException(status_code=404, detail="Resource not found")
    return r
