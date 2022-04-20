"""Imports"""
from datetime import datetime
from typing import List
from uuid import UUID

from app.model.entry import EntryOut
from app.model.resource import ResourceIn, ResourceOut
from app.model.state import State
from app.storage.schema import Entry, Resource
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


def get_resource(database: Session, resource_uuid: UUID) -> ResourceOut | None:
    """Get an existing resource."""
    return (
        database.query(Resource)
        .filter(Resource.resource_uuid == str(resource_uuid))
        .first()
    )


def update_resource(
    database: Session, resource_uuid: UUID, resource: ResourceIn, now: datetime
) -> ResourceOut:
    """Update an existing resource"""
    database.query(Resource).filter(
        Resource.resource_uuid == str(resource_uuid)
    ).update(
        {
            Resource.name: resource.name,
            Resource.description: resource.description,
            Resource.updated: now,
        }
    )
    existing_resource: ResourceOut | None = (
        database.query(Resource)
        .filter(Resource.resource_uuid == str(resource_uuid))
        .first()
    )
    if existing_resource is None:
        raise BaseException("Resource not found")
    database.commit()
    return existing_resource


def deactivate_resource(
    database: Session, resource_uuid: UUID, now: datetime
) -> ResourceOut:
    """Deactivates a resource (does not delete it)."""
    database.query(Resource).filter(
        Resource.resource_uuid == str(resource_uuid)
    ).update({Resource.updated: now, Resource.state: State.INACTIVE})
    existing_resource: ResourceOut | None = (
        database.query(Resource)
        .filter(Resource.resource_uuid == str(resource_uuid))
        .first()
    )
    if existing_resource is None:
        raise BaseException("Resource not found")
    database.commit()
    return existing_resource


def get_entries(database: Session, resource_uuid: UUID) -> List[EntryOut]:
    """Get a list of all entries of a resources, irrespective of their state."""
    resource: ResourceOut | None = (
        database.query(Resource)
        .filter(Resource.resource_uuid == str(resource_uuid))
        .filter(Resource.state == State.ACTIVE)
        .first()
    )
    if resource is None:
        raise BaseException("Resource not found")
    return resource.entries
