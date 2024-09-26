# Displays info when running `just` without subcommand
default:
    @echo 'Run `just --list` to see all available recipes'

gdn-dev:
    yarn gdn-dev

gdn-build:
    yarn gdn-build

lst-dev:
    yarn lst-dev

lst-build:
    yarn lst-build

rst-dev:
    yarn rst-dev

rst-build:
    yarn rst-build

hhh-dev:
    yarn hhh-dev

hhh-build:
    yarn hhh-build

# Update environment and dependencies
update:
    nix flake update
    yarn dlx npm-check-updates -u

# Install dependencies
install:
    yarn install
