FROM python:3.10-slim

RUN apt update && apt install -y --no-install-recommends \
    curl \
    sudo \
    git

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

RUN apt update && apt install -y --no-install-recommends \
    nodejs \
    yarn

RUN rm -rf /var/lib/apt/lists/* \
    && apt clean
