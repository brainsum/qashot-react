#!/usr/bin/env bash

COMPOSE_BUILD_FILES="-f docker-compose.yml -f docker-compose.build.yml"

docker login \
    && docker-compose ${COMPOSE_BUILD_FILES} push
