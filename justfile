# Displays info when running `just` without subcommand
default:
    @echo 'Run `just --list` to see all available recipes'

rst-dev:
    yarn rst-dev

rst-build:
    yarn rst-build
