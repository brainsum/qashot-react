#!/usr/bin/env bash

COMPOSE_BUILD_FILES="-f docker-compose.yml -f docker-compose.build.yml"

docker-compose ${COMPOSE_BUILD_FILES} build --force-rm app server
