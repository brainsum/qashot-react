#!/usr/bin/env bash

docker-compose down -v && \
    docker-compose up -d --force-recreate --remove-orphans

docker-compose ps
