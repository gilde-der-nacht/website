from fastapi import APIRouter, HTTPException, status
from fastapi.encoders import jsonable_encoder
from datetime import datetime
from uuid import UUID, uuid4
from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

router = APIRouter(
    prefix="/resources",
    tags=["resources"],
)

fake_db = []


class Status(str, Enum):
    active = "active"
    inactive = "inactive"


class ResourceIn(BaseModel):
    name: str
    description: Optional[str] = None

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
                "description": "Short description of the resource (can be null)",
                "uuid": uuid4(),
                "created": datetime.now(),
                "udpated": datetime.now(),
                "status": Status.active
            }
        }


@router.get("/", response_model=List[ResourceOut])
def read_resources(status: Optional[Status] = None):
    """
    Retrieve all resources. Use the `status` query to filter only "active" or "inactive" resources.
    """
    if not status:
        return fake_db
    return [res for res in fake_db if res.get("status") == status]


@router.post("/", response_model=UUID, status_code=status.HTTP_201_CREATED)
def create_resource(resource: ResourceIn):
    """
    Create a new resource.
    """
    now = datetime.now()
    new_resource = {
        **jsonable_encoder(resource),
        "uuid": uuid4(),
        "created": now,
        "updated": now,
        "status": Status.active,
    }

    fake_db.append(new_resource)
    return new_resource.get("uuid")

@router.get("/{uuid}", response_model=ResourceOut)
def read_resource(uuid: UUID):
    """
    Retrive one resource.
    """
    r = next((res for res in fake_db
              if res.get("uuid") == uuid and res.get("status") == Status.active), None)

    if not r:
        raise HTTPException(status_code=404, detail="Resource not found")
    return r


@router.put("/{uuid}", response_model=ResourceOut)
def update_resource(uuid: UUID, resource: ResourceIn):
    """
    Update an existing resource.
    """
    now = datetime.now()
    r = next((res for res in fake_db
              if res.get("uuid") == uuid and res.get("status") == Status.active), None)

    if not r:
        raise HTTPException(status_code=404, detail="Resource not found")

    r.update({**jsonable_encoder(resource), "updated": now})
    return r


@router.delete("/{uuid}", response_model=ResourceOut)
def deactivate_resource(uuid: UUID):
    """
    Deactivates a resource (does not delete it).
    """
    now = datetime.now()
    r = next((res for res in fake_db
              if res.get("uuid") == uuid and res.get("status") == Status.active), None)

    if not r:
        raise HTTPException(status_code=404, detail="Resource not found")

    r.update({"updated": now, "status": Status.inactive})
    return r
