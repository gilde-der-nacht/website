from datetime import datetime
from typing import List
from uuid import UUID, uuid4

from app.model.status import Status
from app.model.resource import ResourceIn, ResourceOut
from app.model.entry import EntryIn, EntryOut


class FakeDatabase:
    data = []

    def resources_by_status(self, status: Status) -> List[ResourceOut]:
        return [res for res in self.data if res.get("status") == status]

    def resource_by_id(self, resource_uuid: UUID):
        return next((res for res in self.data
                     if res.get("resource_uuid") == resource_uuid and res.get("status") == Status.active), None)

    def create_resource(self, res: ResourceIn) -> UUID:
        now = datetime.now()
        new_resource = {
            **res,
            "entries": [],
            "resource_uuid": uuid4(),
            "created": now,
            "updated": now,
            "status": Status.active,
        }
        self.data.append(new_resource)
        return new_resource.get("resource_uuid")

    def update_resource(self, resource_uuid: UUID, res: ResourceIn) -> ResourceOut:
        now = datetime.now()
        r = self.resource_by_id(resource_uuid)
        if not r:
            return None
        r.update({**res, "updated": now})
        return r

    def deactivate_resource(self, resource_uuid: UUID) -> ResourceOut:
        now = datetime.now()
        r = self.resource_by_id(resource_uuid)
        if not r:
            return None
        r.update({"updated": now, "status": Status.inactive})
        return r

    def entries_by_resource_id(self, resource_uuid: UUID) -> List[EntryOut]:
        res = self.resource_by_id(resource_uuid)
        if not res:
            return None
        return res.get("entries")

    def create_entry(self, resource_uuid: UUID, entry: EntryIn) -> UUID:
        res = self.resource_by_id(resource_uuid)
        if not res:
            return None
        now = datetime.now()
        new_entry = {
            **entry,
            "entry_uuid": uuid4(),
            "created": now,
            "updated": now,
            "status": Status.active,
        }
        res.get("entries").append(new_entry)
        return new_entry.get("entry_uuid")

    def entry_by_id(self, resource_uuid, entry_uuid) -> EntryOut:
        res = self.resource_by_id(resource_uuid)
        if not res:
            return None
        e = next((entry for entry in res.get("entries")
                  if entry.get("entry_uuid") == entry_uuid and entry.get("status") == Status.active), None)
        if not e:
            return None
        return e

    def update_resource(self, resource_uuid: UUID, entry_uuid: UUID, entry: EntryIn) -> EntryOut:
        res = self.resource_by_id(resource_uuid)
        if not res:
            return None
        e = next((entry for entry in res.get("entries")
                  if entry.get("entry_uuid") == entry_uuid and entry.get("status") == Status.active), None)
        if not e:
            return None
        now = datetime.now()
        e.update({**entry, "updated": now})
        return e

    def deactivate_entry(self, resource_uuid: UUID, entry_uuid: UUID) -> EntryOut:
        res = self.resource_by_id(resource_uuid)
        if not res:
            return None
        e = next((entry for entry in res.get("entries")
                  if entry.get("entry_uuid") == entry_uuid and entry.get("status") == Status.active), None)
        if not e:
            return None
        e.update({"updated": now, "status": Status.inactive})
        now = datetime.now()
        return e


fake_db = FakeDatabase()


def get_fake_db():
    return fake_db
