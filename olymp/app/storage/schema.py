from codecs import backslashreplace_errors
from app.storage.database import Base
from sqlalchemy import Column, DateTime, String, ForeignKey
from sqlalchemy.orm import relationship


class Resource(Base):
    __tablename__ = "resources"

    resource_uuid = Column(String, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    created = Column(DateTime)
    updated = Column(DateTime)
    status = Column(String, default="active")

    entries = relationship("Entry", back_populates="resource")


class Entry(Base):
    __tablename__ = "entries"

    resource_uuid = Column(String, ForeignKey("resources.resource_uuid"))
    entry_uuid = Column(String, primary_key=True, index=True)
    private_body = Column(String)
    public_body = Column(String)
    created = Column(DateTime)
    updated = Column(DateTime)
    status = Column(String, default="active")

    resource = relationship("Resource", back_populates="entries")
