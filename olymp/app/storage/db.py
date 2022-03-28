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

    def resource_by_id(self, uuid: UUID):
        return next((res for res in self.data
                     if res.get("uuid") == uuid and res.get("status") == Status.active), None)

    def create_resource(self, res: ResourceIn) -> UUID:
        now = datetime.now()
        new_resource = {
            **res,
            "entries": [],
            "uuid": uuid4(),
            "created": now,
            "updated": now,
            "status": Status.active,
        }
        self.data.append(new_resource)
        return new_resource.get("uuid")

    def update_resource(self, uuid: UUID, res: ResourceIn) -> ResourceOut:
        now = datetime.now()
        r = self.resource_by_id(uuid)
        if not r:
            return None
        r.update({**res, "updated": now})
        return r

    def deactivate_resource(self, uuid: UUID) -> ResourceOut:
        now = datetime.now()
        r = self.resource_by_id(uuid)
        if not r:
            return None
        r.update({"updated": now, "status": Status.inactive})
        return r

    def entries_by_resource_id(self, uuid: UUID) -> List[EntryOut]:
        res = self.resource_by_id(uuid)
        if not res:
            return None
        return res.get("entries")

    def create_entry(self, uuid: UUID, entry: EntryIn) -> UUID:
        res = self.resource_by_id(uuid)
        if not res:
            return None
        now = datetime.now()
        new_entry = {
            **entry,
            "uuid": uuid4(),
            "created": now,
            "updated": now,
            "status": Status.active,
        }
        res.get("entries").append(new_entry)
        return new_entry.get("uuid")

    def entry_by_id(self, r_uuid, e_uuid) -> EntryOut:
        res = self.resource_by_id(r_uuid)
        if not res:
            return None
        e = next((entry for entry in res.get("entries")
                  if entry.get("uuid") == e_uuid and entry.get("status") == Status.active), None)
        if not e:
            return None
        return e

    def update_resource(self, r_uuid: UUID, e_uuid: UUID, entry: EntryIn) -> EntryOut:
        res = self.resource_by_id(r_uuid)
        if not res:
            return None
        e = next((entry for entry in res.get("entries")
                  if entry.get("uuid") == e_uuid and entry.get("status") == Status.active), None)
        if not e:
            return None
        now = datetime.now()
        e.update({**entry, "updated": now})
        return e

    def deactivate_entry(self, r_uuid: UUID, e_uuid: UUID) -> EntryOut:
        res = self.resource_by_id(r_uuid)
        if not res:
            return None
        e = next((entry for entry in res.get("entries")
                  if entry.get("uuid") == e_uuid and entry.get("status") == Status.active), None)
        if not e:
            return None
        e.update({"updated": now, "status": Status.inactive})
        now = datetime.now()
        return e


fake_db = FakeDatabase()


def get_fake_db():
    return fake_db
