from datetime import datetime
from typing import List, Optional
from uuid import UUID, uuid4

from app.model.resource import ResourceIn, ResourceOut
from app.model.status import Status
from app.storage import crud, schema
from app.storage.database import SessionLocal, engine
from app.storage.db import FakeDatabase, get_fake_db
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session


schema.Base.metadata.create_all(bind=engine)


router = APIRouter(
    prefix="/resources",
    tags=["resources"],
    responses={404: {"description": "Not found"}},
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[ResourceOut])
def read_resources(status: Optional[Status] = None, db: Session = Depends(get_db)):
    """
    Retrieve all resources. Use the `status` query to filter only "active" or "inactive" resources.
    """
    return crud.get_resources(db, status=status)


@router.post("/", response_model=ResourceOut, status_code=status.HTTP_201_CREATED)
def create_resource(resource: ResourceIn, db: Session = Depends(get_db)):
    """
    Create a new resource.
    """
    now = datetime.now()
    new_resource = ResourceOut(resource_uuid=uuid4(),
                               name=resource.name,
                               description=resource.description,
                               entries=[],
                               created=now,
                               updated=now,
                               status=Status.active)
    return crud.create_resource(db, new_resource)


@router.get("/{resource_uuid}/", response_model=ResourceOut)
def read_resource(resource_uuid: UUID, db: Session = Depends(get_db)):
    """
    Retrive one resource.
    """
    db_resource = crud.get_resource(db, resource_uuid=resource_uuid)
    if db_resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    return db_resource


@ router.put("/{resource_uuid}/", response_model=ResourceOut)
def update_resource(resource_uuid: UUID, resource: ResourceIn, db: FakeDatabase = Depends(get_fake_db)):
    """
    Update an existing resource.
    """
    try:
        return db.update_resource(resource_uuid, resource)
    except BaseException as e:
        raise HTTPException(status_code=404, detail=str(e))


@ router.delete("/{resource_uuid}/", response_model=ResourceOut)
def deactivate_resource(resource_uuid: UUID, db: FakeDatabase = Depends(get_fake_db)):
    """
    Deactivates a resource (does not delete it).
    """
    try:
        return db.deactivate_resource(resource_uuid)
    except BaseException as e:
        raise HTTPException(status_code=404, detail=str(e))
