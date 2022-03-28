from datetime import datetime
from enum import Enum
from uuid import uuid4


class Status(str, Enum):
    active = "active"
    inactive = "inactive"


class FakeDatabase:
    data = []

    def filtered_data(self, status):
        return [res for res in self.data if res.get("status") == status]

    def resource_by_id(self, uuid):
        return next((res for res in self.data
                     if res.get("uuid") == uuid and res.get("status") == Status.active), None)

    def create_resource(self, res):
        now = datetime.now()
        new_resource = {
            **res,
            "uuid": uuid4(),
            "created": now,
            "updated": now,
            "status": Status.active,
        }
        self.data.append(new_resource)
        return new_resource.get("uuid")

    def update_resource(self, uuid, res):
        now = datetime.now()
        r = self.resource_by_id(uuid)
        if not r:
            return None
        r.update({**res, "updated": now})
        return r

    def deactivate_resource(self, uuid):
        now = datetime.now()
        r = self.resource_by_id(uuid)
        if not r:
            return None
        r.update({"updated": now, "status": Status.inactive})
        return r


fake_db = FakeDatabase()


def get_fake_db():
    return fake_db
