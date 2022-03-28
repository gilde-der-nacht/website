from typing import List, Optional
from uuid import UUID

from app.model.resource import ResourceIn, ResourceOut
from app.model.status import Status
from app.storage.db import FakeDatabase, get_fake_db
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(
    prefix="/resources",
    tags=["resources"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[ResourceOut])
def read_resources(status: Optional[Status] = None, db: FakeDatabase = Depends(get_fake_db)):
    """
    Retrieve all resources. Use the `status` query to filter only "active" or "inactive" resources.
    """
    if not status:
        return db.data
    return db.resources_by_status(status)


@router.post("/", response_model=UUID, status_code=status.HTTP_201_CREATED)
def create_resource(resource: ResourceIn, db: FakeDatabase = Depends(get_fake_db)):
    """
    Create a new resource.
    """
    return db.create_resource(resource)


@router.get("/{resource_uuid}/", response_model=ResourceOut)
def read_resource(resource_uuid: UUID, db: FakeDatabase = Depends(get_fake_db)):
    """
    Retrive one resource.
    """
    try:
        return db.resource_by_id(resource_uuid)
    except BaseException as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{resource_uuid}/", response_model=ResourceOut)
def update_resource(resource_uuid: UUID, resource: ResourceIn, db: FakeDatabase = Depends(get_fake_db)):
    """
    Update an existing resource.
    """
    try:
        return db.update_resource(resource_uuid, resource)
    except BaseException as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{resource_uuid}/", response_model=ResourceOut)
def deactivate_resource(resource_uuid: UUID, db: FakeDatabase = Depends(get_fake_db)):
    """
    Deactivates a resource (does not delete it).
    """
    try:
        return db.deactivate_resource(resource_uuid)
    except BaseException as e:
        raise HTTPException(status_code=404, detail=str(e))
