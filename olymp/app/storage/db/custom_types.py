from sqlalchemy import String, TypeDecorator


class UUIDv4(TypeDecorator):
    """
    Uses STRING.
    """

    impl = String
    cache_ok = True

    def load_dialect_impl(self, dialect):
        return dialect.type_descriptor(String)

    def process_bind_param(self, value, _dialect):
        if value is None:
            return value
        else:
            return str(value)

    def process_result_value(self, value, _dialect):
        return value
