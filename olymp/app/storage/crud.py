"""Imports"""
from datetime import datetime
from uuid import UUID

from app.model.entry import EntryIn, EntryOut
from app.model.resource import ResourceIn, ResourceOut
from app.model.state import State
from app.storage.schema import Entry, Resource
from sqlalchemy.orm import Session


def get_resources(database: Session) -> list[ResourceOut]:
    """Get a list of all resources, irrespective of state."""
    return database.query(Resource).all()


def get_resources_by_state(database: Session, state: State) -> list[ResourceOut]:
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
    print(db_resource)
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
) -> ResourceOut | None:
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
    database.commit()
    return (
        database.query(Resource)
        .filter(Resource.resource_uuid == str(resource_uuid))
        .first()
    )


def deactivate_resource(
    database: Session, resource_uuid: UUID, now: datetime
) -> ResourceOut | None:
    """Deactivates a resource (does not delete it)."""
    database.query(Resource).filter(
        Resource.resource_uuid == str(resource_uuid)
    ).update({Resource.updated: now, Resource.state: State.INACTIVE})
    database.commit()
    return (
        database.query(Resource)
        .filter(Resource.resource_uuid == str(resource_uuid))
        .first()
    )


def get_entries(database: Session, resource_uuid: UUID) -> list[EntryOut]:
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


def get_entries_by_state(
    database: Session, resource_uuid: UUID, state: State
) -> list[EntryOut]:
    """Get a list of all entries of a resources, filtered by state."""
    resource: ResourceOut | None = (
        database.query(Resource)
        .filter(Resource.resource_uuid == str(resource_uuid))
        .filter(Resource.state == State.ACTIVE)
        .first()
    )
    if resource is None:
        raise BaseException("Resource not found")
    return (
        database.query(Entry)
        .filter(Entry.resource == resource)
        .filter(Entry.state == state.value)
        .all()
    )


def create_entry(database: Session, resource_uuid: UUID, entry: EntryOut) -> EntryOut:
    """Create a new entry."""
    resource: ResourceOut | None = (
        database.query(Resource)
        .filter(Resource.resource_uuid == str(resource_uuid))
        .filter(Resource.state == State.ACTIVE)
        .first()
    )
    if resource is None:
        raise BaseException("Resource not found")
    db_entry = Entry(
        entry_uuid=str(entry.entry_uuid),
        public_body=entry.public_body,
        private_body=entry.private_body,
        created=entry.created,
        updated=entry.updated,
        state=entry.state,
        resource=resource,
    )
    database.add(db_entry)
    database.commit()
    database.refresh(db_entry)
    return entry


def get_entry(
    database: Session, resource_uuid: UUID, entry_uuid: UUID
) -> EntryOut | None:
    """Retrive one entry."""
    resource: ResourceOut | None = (
        database.query(Resource)
        .filter(Resource.resource_uuid == str(resource_uuid))
        .filter(Resource.state == State.ACTIVE)
        .first()
    )
    if resource is None:
        raise BaseException("Resource not found")
    return (
        database.query(Entry)
        .filter(Entry.resource == resource)
        .filter(Entry.entry_uuid == str(entry_uuid))
        .first()
    )


def update_entry(
    database: Session,
    resource_uuid: UUID,
    entry_uuid: UUID,
    entry: EntryIn,
    now: datetime,
) -> EntryOut | None:
    """Update an existing entry."""
    resource: ResourceOut | None = (
        database.query(Resource)
        .filter(Resource.resource_uuid == str(resource_uuid))
        .filter(Resource.state == State.ACTIVE)
        .first()
    )
    if resource is None:
        raise BaseException("Resource not found")
    database.query(Entry).filter(Entry.resource == resource).filter(
        Entry.entry_uuid == str(entry_uuid)
    ).update(
        {
            Entry.public_body: entry.public_body,
            Entry.private_body: entry.private_body,
            Entry.updated: now,
        }
    )
    database.commit()
    return (
        database.query(Entry)
        .filter(Entry.resource == resource)
        .filter(Entry.entry_uuid == str(entry_uuid))
        .first()
    )


def deactivate_entry(
    database: Session, resource_uuid: UUID, entry_uuid: UUID, now: datetime
) -> EntryOut | None:
    """Deactivates an entry (does not delete it)."""
    resource: ResourceOut | None = (
        database.query(Resource)
        .filter(Resource.resource_uuid == str(resource_uuid))
        .filter(Resource.state == State.ACTIVE)
        .first()
    )
    if resource is None:
        raise BaseException("Resource not found")
    database.query(Entry).filter(Entry.resource == resource).filter(
        Entry.entry_uuid == str(entry_uuid)
    ).update({Entry.updated: now, Entry.state: State.INACTIVE})
    database.commit()
    return (
        database.query(Entry)
        .filter(Entry.resource == resource)
        .filter(Entry.entry_uuid == str(entry_uuid))
        .first()
    )
