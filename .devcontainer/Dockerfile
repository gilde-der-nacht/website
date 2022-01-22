FROM node:16-slim

ARG DEBIAN_FRONTEND=noninteractive

RUN apt update

RUN apt install -y \
    git \
    nodejs \
    yarn

RUN rm -rf /var/lib/apt/lists/* \
    && apt clean
