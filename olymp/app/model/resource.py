from datetime import datetime
from typing import List, Optional
from uuid import UUID, uuid4

from app.model.entry import EntryOut
from app.model.status import Status
from pydantic import BaseModel


class ResourceIn(BaseModel):
    name: str
    description: Optional[str] = ""

    class Config:
        schema_extra = {
            "example": {
                "name": "Name of the new resource",
                "description": "Short description of the resource (optional)"
            }
        }


class ResourceOut(ResourceIn):
    entries: List[EntryOut]
    resource_uuid: UUID
    created: datetime
    updated: datetime
    status: Status

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "name": "Resource name",
                "description": "Short description of the resource (can be empty)",
                "entries": [{
                    "entry_uuid": uuid4(),
                    "created": datetime.now(),
                    "updated": datetime.now(),
                    "status": Status.active}],
                "resource_uuid": uuid4(),
                "created": datetime.now(),
                "udpated": datetime.now(),
                "status": Status.active
            }
        }
