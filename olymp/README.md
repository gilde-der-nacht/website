# Olymp Server

### Requirements

- Python 3.6+

There is a [Dockerfile](https://github.com/gilde-der-nacht/website/blob/theme-crimson/.devcontainer/Dockerfile) which can be use to build a development environment.

## Install Dependencies

```sh
$ pip3 install -r requirements.txt
```

## Develop

```sh
$ uvicorn app.main:app --reload
```

## Deployment

```sh
$ docker-compose -f ./docker-compose.deploy.yml up -d # locally
$ DOCKER_HOST="ssh://[user]@[host]:[port]" docker-compose -f ./docker-compose.deploy.yml up -d # remote
```

## Migrations

```sh
$ alembic upgrade head # upgrade the database to the latest schema

$ alembic revision --autogenerate -m "message" # create a new version in the migrations history
```
