from datetime import datetime
from typing import List, Optional
from uuid import UUID, uuid4
from pydantic import BaseModel

from app.model.status import Status
from app.model.entry import EntryOut


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
    uuid: UUID
    created: datetime
    updated: datetime
    status: Status

    class Config:
        schema_extra = {
            "example": {
                "name": "Resource name",
                "description": "Short description of the resource (can be empty)",
                "entries": [EntryOut(
                    uuid=uuid4(),
                    created=datetime.now(),
                    updated=datetime.now(),
                    status=Status.active)],
                "uuid": uuid4(),
                "created": datetime.now(),
                "udpated": datetime.now(),
                "status": Status.active
            }
        }
