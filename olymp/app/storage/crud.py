"""Imports"""
from datetime import datetime
from uuid import UUID, uuid4

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
        resource_uuid=resource.resource_uuid,
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
        database.query(Resource).filter(Resource.resource_uuid == resource_uuid).first()
    )


def update_resource(
    database: Session, resource_uuid: UUID, resource: ResourceIn, now: datetime
) -> ResourceOut | None:
    """Update an existing resource"""
    database.query(Resource).filter(Resource.resource_uuid == resource_uuid).update(
        {
            Resource.name: resource.name,
            Resource.description: resource.description,
            Resource.updated: now,
        }
    )
    database.commit()
    return (
        database.query(Resource).filter(Resource.resource_uuid == resource_uuid).first()
    )


def deactivate_resource(
    database: Session, resource_uuid: UUID, now: datetime
) -> ResourceOut | None:
    """Deactivates a resource (does not delete it)."""
    database.query(Resource).filter(Resource.resource_uuid == resource_uuid).update(
        {Resource.updated: now, Resource.state: State.INACTIVE}
    )
    database.commit()
    return (
        database.query(Resource).filter(Resource.resource_uuid == resource_uuid).first()
    )


def get_entries(database: Session, resource_uuid: UUID) -> list[EntryOut]:
    """Get a list of all entries of a resources, irrespective of their state."""
    resource: ResourceOut | None = (
        database.query(Resource)
        .filter(Resource.resource_uuid == resource_uuid)
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
        .filter(Resource.resource_uuid == resource_uuid)
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
        .filter(Resource.resource_uuid == resource_uuid)
        .filter(Resource.state == State.ACTIVE)
        .first()
    )
    if resource is None:
        raise BaseException("Resource not found")
    db_entry = Entry(
        entry_uuid=entry.entry_uuid,
        snapshot_uuid=entry.snapshot_uuid,
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
        .filter(Resource.resource_uuid == resource_uuid)
        .filter(Resource.state == State.ACTIVE)
        .first()
    )
    if resource is None:
        raise BaseException("Resource not found")
    return (
        database.query(Entry)
        .filter(Entry.resource == resource)
        .filter(Entry.entry_uuid == entry_uuid)
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
        .filter(Resource.resource_uuid == resource_uuid)
        .filter(Resource.state == State.ACTIVE)
        .first()
    )
    if resource is None:
        raise BaseException("Resource not found")
    database.query(Entry).filter(Entry.resource == resource).filter(
        Entry.entry_uuid == entry_uuid
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
        .filter(Entry.entry_uuid == entry_uuid)
        .first()
    )


def deactivate_entry(
    database: Session, resource_uuid: UUID, entry_uuid: UUID, now: datetime
) -> EntryOut | None:
    """Deactivates an entry (does not delete it)."""
    resource: ResourceOut | None = (
        database.query(Resource)
        .filter(Resource.resource_uuid == resource_uuid)
        .filter(Resource.state == State.ACTIVE)
        .first()
    )
    if resource is None:
        raise BaseException("Resource not found")
    database.query(Entry).filter(Entry.resource == resource).filter(
        Entry.entry_uuid == entry_uuid
    ).update({Entry.updated: now, Entry.state: State.INACTIVE})
    database.commit()
    return (
        database.query(Entry)
        .filter(Entry.resource == resource)
        .filter(Entry.entry_uuid == entry_uuid)
        .first()
    )


def get_snapshots(database: Session, resource_uuid: UUID) -> list[EntryOut]:
    """Get a list of all the latest snapshots of a resources, irrespective of their state."""
    resource: ResourceOut | None = (
        database.query(Resource)
        .filter(Resource.resource_uuid == resource_uuid)
        .filter(Resource.state == State.ACTIVE)
        .first()
    )
    if resource is None:
        raise BaseException("Resource not found")
    all_entries: list[EntryOut] = (
        database.query(Entry).filter(Entry.resource == resource).all()
    )
    all_snapshot_uuids = {entry.snapshot_uuid for entry in all_entries}
    return sorted(
        [
            (
                database.query(Entry)
                .filter(Entry.resource == resource)
                .filter(Entry.snapshot_uuid == snapshot_uuids)
                .all()
            )[-1]
            for snapshot_uuids in all_snapshot_uuids
        ],
        key=lambda entry: entry.updated,
        reverse=True,
    )


def get_snapshots_by_state(
    database: Session, resource_uuid: UUID, state: State
) -> list[EntryOut]:
    """Get a list of all the latest snapshots of a resources, filtered by state."""
    resource: ResourceOut | None = (
        database.query(Resource)
        .filter(Resource.resource_uuid == resource_uuid)
        .filter(Resource.state == State.ACTIVE)
        .first()
    )
    if resource is None:
        raise BaseException("Resource not found")
    resource: ResourceOut | None = (
        database.query(Resource)
        .filter(Resource.resource_uuid == resource_uuid)
        .filter(Resource.state == State.ACTIVE)
        .first()
    )
    if resource is None:
        raise BaseException("Resource not found")
    all_entries: list[EntryOut] = (
        database.query(Entry).filter(Entry.resource == resource).all()
    )
    all_snapshot_uuids = {entry.snapshot_uuid for entry in all_entries}
    all_snapshots: list[EntryOut] = sorted(
        [
            (
                database.query(Entry)
                .filter(Entry.resource == resource)
                .filter(Entry.snapshot_uuid == snapshot_uuids)
                .all()
            )[-1]
            for snapshot_uuids in all_snapshot_uuids
        ],
        key=lambda entry: entry.updated,
        reverse=True,
    )
    return [snapshot for snapshot in all_snapshots if snapshot.state == state]


def get_snapshot(
    database: Session, resource_uuid: UUID, snapshot_uuid: UUID
) -> EntryOut | None:
    """Retrive latest snapshot."""
    resource: ResourceOut | None = (
        database.query(Resource)
        .filter(Resource.resource_uuid == resource_uuid)
        .filter(Resource.state == State.ACTIVE)
        .first()
    )
    if resource is None:
        raise BaseException("Resource not found")
    return (
        database.query(Entry)
        .filter(Entry.resource == resource)
        .filter(Entry.snapshot_uuid == snapshot_uuid)
        .all()
    )[-1]


def update_snapshot(
    database: Session,
    resource_uuid: UUID,
    snapshot_uuid: UUID,
    entry: EntryIn,
    now: datetime,
) -> EntryOut | None:
    """Update an existing snapshot."""
    resource: ResourceOut | None = (
        database.query(Resource)
        .filter(Resource.resource_uuid == resource_uuid)
        .filter(Resource.state == State.ACTIVE)
        .first()
    )
    if resource is None:
        raise BaseException("Resource not found")
    latest_snapshot: EntryOut | None = (
        database.query(Entry)
        .filter(Entry.resource == resource)
        .filter(Entry.snapshot_uuid == snapshot_uuid)
        .all()
    )[-1]
    if latest_snapshot is None:
        raise BaseException("Snapshot not found")
    updated_snapshot = EntryOut(
        entry_uuid=uuid4(),
        snapshot_uuid=latest_snapshot.snapshot_uuid,
        public_body=entry.public_body,
        private_body=entry.private_body,
        created=latest_snapshot.created,
        updated=now,
        state=latest_snapshot.state,
    )
    db_entry = Entry(
        entry_uuid=updated_snapshot.entry_uuid,
        snapshot_uuid=updated_snapshot.snapshot_uuid,
        public_body=updated_snapshot.public_body,
        private_body=updated_snapshot.private_body,
        created=updated_snapshot.created,
        updated=updated_snapshot.updated,
        state=updated_snapshot.state,
        resource=resource,
    )
    database.add(db_entry)
    database.commit()
    database.refresh(db_entry)
    return updated_snapshot
