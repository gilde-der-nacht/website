"""Imports"""
import enum

from app.storage.database import Base
from sqlalchemy import JSON, Column, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import relationship


class State(str, enum.Enum):
    """Database schema."""

    ACTIVE = "active"
    INACTIVE = "inactive"


class Resource(Base):
    """Database schema."""

    __tablename__ = "resources"

    resource_uuid = Column(String, primary_key=True, index=True, nullable=False)
    name = Column(String)
    description = Column(String)
    created = Column(DateTime)
    updated = Column(DateTime)
    state = Column(Enum(State))

    entries = relationship("Entry", back_populates="resource")


class Entry(Base):
    """Database schema."""

    __tablename__ = "entries"

    resource_uuid = Column(String, ForeignKey("resources.resource_uuid"))
    entry_uuid = Column(String, primary_key=True, index=True, nullable=False)
    snapshot_uuid = Column(
        String, server_default="00000000-0000-0000-0000-000000000000"
    )
    private_body = Column(JSON)
    public_body = Column(JSON)
    created = Column(DateTime)
    updated = Column(DateTime)
    state = Column(Enum(State))

    resource = relationship("Resource", back_populates="entries")
