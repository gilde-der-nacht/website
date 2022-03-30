"""Imports"""
from datetime import datetime
from typing import List, Optional
from uuid import UUID, uuid4

from app.model.entry import EntryOut
from app.model.state import State
from pydantic import BaseModel


class ResourceIn(BaseModel):
    """Model for incoming, user provided resources."""

    name: str
    description: Optional[str] = ""

    class Config:
        """Additional configuration of the pydantic model."""

        schema_extra = {
            "example": {
                "name": "Name of the new resource",
                "description": "Short description of the resource (optional)",
            }
        }


class ResourceOut(ResourceIn):
    """Model for outgoing resources."""

    entries: List[EntryOut]
    resource_uuid: UUID
    created: datetime
    updated: datetime
    state: State

    class Config:
        """Additional configuration of the pydantic model."""

        orm_mode = True
        schema_extra = {
            "example": {
                "name": "Resource name",
                "description": "Short description of the resource (can be empty)",
                "entries": [
                    {
                        "entry_uuid": uuid4(),
                        "created": datetime.now(),
                        "updated": datetime.now(),
                        "state": State.ACTIVE,
                    }
                ],
                "resource_uuid": uuid4(),
                "created": datetime.now(),
                "udpated": datetime.now(),
                "state": State.ACTIVE,
            }
        }
