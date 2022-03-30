#! /usr/bin/env bash

# Run migrations
alembic upgrade head

# Start server
exec uvicorn app.main:app --proxy-headers --host 0.0.0.0 --port 80
