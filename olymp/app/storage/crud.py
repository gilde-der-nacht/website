from uuid import UUID

from app.model.resource import ResourceOut
from app.model.status import Status
from app.storage.schema import Resource
from sqlalchemy.orm import Session


def get_resources(db: Session):
    return db.query(Resource).all()


def get_resources_by_status(db: Session, status: Status):
    return db.query(Resource).filter(Resource.status == status.value).all()


def create_resource(db: Session, resource: ResourceOut):
    db_resource = Resource(
        resource_uuid=str(resource.resource_uuid),
        name=resource.name,
        description=resource.description,
        created=resource.created,
        updated=resource.updated,
        status=resource.status,
        entries=resource.entries,
    )
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource


def get_resource(db: Session, resource_uuid: UUID):
    return (
        db.query(Resource).filter(Resource.resource_uuid == str(resource_uuid)).first()
    )
