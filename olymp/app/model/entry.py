from datetime import datetime
from typing import Dict, Optional
from uuid import UUID, uuid4
from pydantic import BaseModel

from app.model.status import Status


class EntryIn(BaseModel):
    private_body: Optional[Dict] = {}
    public_body: Optional[Dict] = {}

    class Config:
        schema_extra = {
            "example": {
                "private_body": {
                    "some_key": ["any possible value"],
                },
                "public_body": {
                    "key": 3,
                    "key_2": None,
                }
            }
        }


class EntryOut(EntryIn):
    entry_uuid: UUID
    created: datetime
    updated: datetime
    status: Status

    class Config:
        schema_extra = {
            "example": {
                "private_body": {
                    "some_key": ["any possible value"],
                },
                "public_body": {
                    "key": 3,
                    "key_2": None,
                },
                "entry_uuid": uuid4(),
                "created": datetime.now(),
                "udpated": datetime.now(),
                "status": Status.active
            }
        }
