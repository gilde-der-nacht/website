"""Imports"""
import enum

from app.storage.database import Base
from sqlalchemy import JSON, Column, DateTime, Enum, ForeignKey, String, TypeDecorator
from sqlalchemy.orm import relationship


class UUIDv4(TypeDecorator):
    """Uses STRING."""

    impl = String
    cache_ok = True

    def load_dialect_impl(self, dialect):
        return dialect.type_descriptor(String)

    def process_bind_param(self, value, _dialect):
        if value is None:
            return value
        return str(value)

    def process_result_value(self, value, _dialect):
        return value


class State(str, enum.Enum):
    """Database schema."""

    ACTIVE = "active"
    INACTIVE = "inactive"


class Resource(Base):
    """Database schema."""

    __tablename__ = "resources"

    resource_uuid = Column(UUIDv4, primary_key=True, index=True, nullable=False)
    name = Column(String)
    description = Column(String)
    created = Column(DateTime)
    updated = Column(DateTime)
    state = Column(Enum(State))

    entries = relationship("Entry", back_populates="resource")


class Entry(Base):
    """Database schema."""

    __tablename__ = "entries"

    resource_uuid = Column(UUIDv4, ForeignKey("resources.resource_uuid"))
    entry_uuid = Column(UUIDv4, primary_key=True, index=True, nullable=False)
    snapshot_uuid = Column(
        UUIDv4, server_default="00000000-0000-0000-0000-000000000000"
    )
    private_body = Column(JSON)
    public_body = Column(JSON)
    created = Column(DateTime)
    updated = Column(DateTime)
    state = Column(Enum(State))

    resource = relationship("Resource", back_populates="entries")
