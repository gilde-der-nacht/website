# Static Site Generation

### Requirements

* nodejs v16
* yarn v1.22

There is a [Dockerfile](https://github.com/gilde-der-nacht/website/blob/theme-crimson/.devcontainer/Dockerfile) which can be use to build a development environment.

Install yarn: https://classic.yarnpkg.com/en/docs/install

## Install Dependencies

```sh
$ yarn --version
$ yarn
```

Required version: 1.22

## Develop

Run one of the following scripts:

```sh
$ yarn dev # for all websites

$ yarn dev:gdn # for gildedernacht.ch

$ yarn dev:lst # for spieltage.ch

$ yarn dev:rst # for rollenspieltage.ch

$ yarn dev:ttt # for tabletoptage.ch
```

## Build

Run one of the following scripts:

```sh
$ yarn build # for all websites

$ yarn build:gdn # for gildedernacht.ch

$ yarn build:lst # for spieltage.ch

$ yarn build:rst # for rollenspieltage.ch

$ yarn build:ttt # for tabletoptage.ch
```

### Drafts and future pages

To build also the drafts and future pages, set the environment variable `ELEVENTY_ENV=development`.

This can also be achieved by running the script `yarn build-dev` which builds all pages incl. drafts and future pages.

## Debug

```sh
$ yarn debug # for debug output from eleventy (SSG)
```
