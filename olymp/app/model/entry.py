"""Imports"""
from datetime import datetime
from typing import Dict, Optional
from uuid import UUID, uuid4

from app.model.state import State
from pydantic import BaseModel


class EntryIn(BaseModel):
    """Model for incoming, user provided entries."""

    private_body: Optional[Dict] = {}
    public_body: Optional[Dict] = {}

    class Config:
        """Additional configuration of the pydantic model."""

        schema_extra = {
            "example": {
                "private_body": {
                    "some_key": ["any possible value"],
                },
                "public_body": {
                    "key": 3,
                    "key_2": None,
                },
            }
        }


class EntryOut(EntryIn):
    """Model for outgoing entries."""

    entry_uuid: UUID
    created: datetime
    updated: datetime
    state: State

    class Config:
        """Additional configuration of the pydantic model."""

        orm_mode = True
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
                "state": State.ACTIVE,
            }
        }
