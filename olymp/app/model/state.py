"""Imports"""
from enum import Enum


class State(str, Enum):
    """Instead of deleting entries in the database, they get set to `inactive`."""

    ACTIVE = "active"
    INACTIVE = "inactive"
