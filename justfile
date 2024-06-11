# Displays info when running `just` without subcommand
default:
    @echo 'Run `just --list` to see all available recipes'

rst-dev:
    yarn rst-dev

rst-build:
    yarn rst-build

# Update environment and dependencies
update:
    nix flake update
    yarn dlx npm-check-updates -u
