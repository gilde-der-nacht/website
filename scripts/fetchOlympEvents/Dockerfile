FROM oven/bun:0.7.3

RUN apt update && apt install -y --no-install-recommends \
    git

RUN rm -rf /var/lib/apt/lists/* \
    && apt clean

COPY index.ts index.ts
COPY package.json package.json
COPY bun.lockb bun.lockb

RUN bun install
