"""Imports"""
from datetime import datetime
from typing import List
from uuid import UUID, uuid4

from app.model.resource import ResourceIn, ResourceOut
from app.model.state import State
from app.storage import crud, schema
from app.storage.database import SessionLocal, engine
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

schema.Base.metadata.create_all(bind=engine)


router = APIRouter(
    prefix="/resources",
    tags=["resources"],
    responses={404: {"description": "Not found"}},
)


def get_db():
    """Get an independent database session per request."""
    database = SessionLocal()
    try:
        yield database
    finally:
        database.close()


@router.get("/", response_model=List[ResourceOut])
def read_resources(state: State | None = None, database: Session = Depends(get_db)):
    """
    Retrieve all resources. Use the `state` query to filter only "active" or "inactive" resources.
    """
    if state is None:
        return crud.get_resources(database)
    return crud.get_resources_by_state(database, state=state)


@router.post("/", response_model=ResourceOut, status_code=status.HTTP_201_CREATED)
def create_resource(resource: ResourceIn, database: Session = Depends(get_db)):
    """Create a new resource."""
    now = datetime.now()
    new_resource = ResourceOut(
        resource_uuid=uuid4(),
        name=resource.name,
        description=resource.description,
        entries=[],
        created=now,
        updated=now,
        state=State.ACTIVE,
    )
    return crud.create_resource(database, new_resource)


@router.get("/{resource_uuid}/", response_model=ResourceOut)
def read_resource(resource_uuid: UUID, database: Session = Depends(get_db)):
    """Retrive one resource."""
    db_resource = crud.get_resource(database, resource_uuid=resource_uuid)
    if db_resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    return db_resource


@router.put("/{resource_uuid}/", response_model=ResourceOut)
def update_resource(
    resource_uuid: UUID,
    resource: ResourceIn,
    database: Session = Depends(get_db),
):
    """Update an existing resource."""
    now = datetime.now()
    try:
        return crud.update_resource(database, resource_uuid, resource, now)
    except BaseException as err:
        raise HTTPException(status_code=404, detail=str(err)) from err


@router.delete("/{resource_uuid}/", response_model=ResourceOut)
def deactivate_resource(resource_uuid: UUID, database: Session = Depends(get_db)):
    """Deactivates a resource (does not delete it)."""
    now = datetime.now()
    try:
        return crud.deactivate_resource(database, resource_uuid, now)
    except BaseException as err:
        raise HTTPException(status_code=404, detail=str(err)) from err
