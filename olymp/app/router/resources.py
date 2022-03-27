from fastapi import APIRouter
from datetime import datetime
from uuid import UUID, uuid4
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(
    prefix="/resources",
    tags=["resources"],
    responses={404: {"description": "Not found"}},
)

fake_db = []


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
    status: str


@router.get("/", response_model=List[ResourceOut])
def read_resources():
    """
    Retrieve all resources.
    """
    return fake_db


@router.post("/", response_model=UUID)
def create_resource(resource: ResourceIn):
    """
    Create a new resource.
    """
    now = datetime.now()
    new_resource: ResourceOut = {
        "uuid": uuid4(),
        "name": resource.name,
        "description": resource.description,
        "created": now,
        "updated": now,
        "status": "active"
    }
    fake_db.append(new_resource)
    return new_resource.get("uuid")
