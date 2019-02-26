#!/usr/bin/env bash

COMPOSE_BUILD_FILES="-f docker-compose.yml -f docker-compose.build.yml"

# @todo: The build service gets rebuilt every time, fix that.
## @note: For that, source code has to be moved to a subdir probably.
docker-compose ${COMPOSE_BUILD_FILES} build --force-rm build \
    && docker-compose ${COMPOSE_BUILD_FILES} build --force-rm app web
