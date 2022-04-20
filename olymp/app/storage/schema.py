"""Imports"""
from app.storage.database import Base
from sqlalchemy import JSON, Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship


class Resource(Base):
    """Database schema."""

    __tablename__ = "resources"

    resource_uuid = Column(String, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    created = Column(DateTime)
    updated = Column(DateTime)
    state = Column(String, default="active")

    entries = relationship("Entry", back_populates="resource")


class Entry(Base):
    """Database schema."""

    __tablename__ = "entries"

    resource_uuid = Column(String, ForeignKey("resources.resource_uuid"))
    entry_uuid = Column(String, primary_key=True, index=True)
    private_body = Column(JSON)
    public_body = Column(JSON)
    created = Column(DateTime)
    updated = Column(DateTime)
    state = Column(String, default="active")

    resource = relationship("Resource", back_populates="entries")
