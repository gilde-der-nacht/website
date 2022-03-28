from datetime import date, datetime
from typing import List
from uuid import UUID, uuid4

from app.model.entry import EntryIn, EntryOut
from app.model.resource import ResourceIn, ResourceOut
from app.model.status import Status


class FakeDatabase:
    data: List[ResourceOut] = []

    def resources_by_status(self, status: Status) -> List[ResourceOut]:
        return [res for res in self.data if res.status == status]

    def resource_by_id(self, resource_uuid: UUID):
        r = next((res for res in self.data
                  if res.resource_uuid == resource_uuid and res.status == Status.active), None)
        if not r:
            raise BaseException("Resource not found")
        return r

    def create_resource(self, res: ResourceIn) -> UUID:
        now = datetime.now()
        new_res = ResourceOut(
            name=res.name,
            description=res.description,
            entries=[],
            resource_uuid=uuid4(),
            created=now,
            updated=now,
            status=Status.active,
        )
        self.data.append(new_res)
        return new_res.resource_uuid

    def update_resource(self, resource_uuid: UUID, res: ResourceIn) -> ResourceOut:
        r = self.resource_by_id(resource_uuid)
        if not r:
            raise BaseException("Resource not found")
        r.name = res.name
        r.description = res.description
        r.updated = datetime.now()
        return r

    def deactivate_resource(self, resource_uuid: UUID) -> ResourceOut:
        r = self.resource_by_id(resource_uuid)
        if not r:
            raise BaseException("Resource not found")
        r.status = Status.inactive
        r.updated = datetime.now()
        return r

    def entries_by_resource_id(self, resource_uuid: UUID) -> List[EntryOut]:
        res = self.resource_by_id(resource_uuid)
        if not res:
            raise BaseException("Resource not found")
        return res.entries

    def create_entry(self, resource_uuid: UUID, entry: EntryIn) -> UUID:
        res = self.resource_by_id(resource_uuid)
        if not res:
            raise BaseException("Resource not found")
        now = datetime.now()
        new_entry = EntryOut(
            private_body=entry.private_body,
            public_body=entry.public_body,
            entry_uuid=uuid4(),
            group_uuid=uuid4(),
            created=now,
            updated=now,
            status=Status.active,
        )
        res.entries.append(new_entry)
        return new_entry.entry_uuid

    def entry_by_id(self, resource_uuid, entry_uuid) -> EntryOut:
        res = self.resource_by_id(resource_uuid)
        if not res:
            raise BaseException("Resource not found")
        e = next((entry for entry in res.entries
                  if entry.entry_uuid == entry_uuid and entry.status == Status.active), None)
        if not e:
            raise BaseException("Entry not found")
        return e

    def update_entry(self, resource_uuid: UUID, entry_uuid: UUID, entry: EntryIn) -> EntryOut:
        res = self.resource_by_id(resource_uuid)
        if not res:
            raise BaseException("Resource not found")
        e = next((entry for entry in res.entries
                  if entry.entry_uuid == entry_uuid and entry.status == Status.active), None)
        if not e:
            raise BaseException("Entry not found")
        e.private_body = entry.private_body
        e.public_body = entry.public_body
        e.updated = datetime.now()
        return e

    def deactivate_entry(self, resource_uuid: UUID, entry_uuid: UUID) -> EntryOut:
        res = self.resource_by_id(resource_uuid)
        if not res:
            raise BaseException("Resource not found")
        e = next((entry for entry in res.entries
                  if entry.entry_uuid == entry_uuid and entry.status == Status.active), None)
        if not e:
            raise BaseException("Entry not found")
        e.updated = datetime.now()
        e.status = Status.inactive
        return e


fake_db = FakeDatabase()


def get_fake_db():
    return fake_db
