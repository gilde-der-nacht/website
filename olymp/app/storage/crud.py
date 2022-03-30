"""Imports"""
from typing import List, Optional
from uuid import UUID

from app.model.resource import ResourceOut
from app.model.state import State
from app.storage.schema import Resource
from sqlalchemy.orm import Session


def get_resources(database: Session) -> List[ResourceOut]:
    """Get a list of all resources, irrespective of state."""
    return database.query(Resource).all()


def get_resources_by_state(database: Session, state: State) -> List[ResourceOut]:
    """Get a list of all resources, filtered by state."""
    return database.query(Resource).filter(Resource.state == state.value).all()


def create_resource(database: Session, resource: ResourceOut) -> ResourceOut:
    """Create a new resource."""
    db_resource = Resource(
        resource_uuid=str(resource.resource_uuid),
        name=resource.name,
        description=resource.description,
        created=resource.created,
        updated=resource.updated,
        state=resource.state,
        entries=resource.entries,
    )
    database.add(db_resource)
    database.commit()
    database.refresh(db_resource)
    return db_resource


def get_resource(database: Session, resource_uuid: UUID) -> Optional[ResourceOut]:
    """Get an existing resource."""
    return (
        database.query(Resource)
        .filter(Resource.resource_uuid == str(resource_uuid))
        .first()
    )
