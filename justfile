# Displays info when running `just` without subcommand
default:
    @just --list

gdn-dev USE_LOCAL_ELYSIUM="false":
    PUBLIC_USE_LOCAL_ELYSIUM={{USE_LOCAL_ELYSIUM}} yarn gdn-dev

gdn-build:
    yarn gdn-build

lst-dev USE_LOCAL_ELYSIUM="false":
    PUBLIC_USE_LOCAL_ELYSIUM={{USE_LOCAL_ELYSIUM}} yarn lst-dev

lst-build:
    yarn lst-build

rst-dev USE_LOCAL_ELYSIUM="false":
    PUBLIC_USE_LOCAL_ELYSIUM={{USE_LOCAL_ELYSIUM}} yarn rst-dev

rst-build:
    yarn rst-build

hhh-dev:
    yarn hhh-dev

hhh-build:
    yarn hhh-build

# Update environment and dependencies
update:
    git pull -r
    nix flake update --flake ./.nix-env
    yarn dlx npm-check-updates -u

# Install dependencies
install:
    yarn install
