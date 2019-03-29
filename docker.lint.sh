#!/usr/bin/env bash

HADOLINT_VERSION=v1.16.0
COMPOSE_BUILD_FILES="-f docker-compose.yml -f docker-compose.build.yml"

docker-compose config -q \
    && docker-compose ${COMPOSE_BUILD_FILES} config -q \
    && docker run --rm -i "hadolint/hadolint:${HADOLINT_VERSION}" < ./docker/server/Dockerfile \
    && docker run --rm -i "hadolint/hadolint:${HADOLINT_VERSION}" < ./Dockerfile \
    && echo "Dockerfiles and docker-compose files are OK"
