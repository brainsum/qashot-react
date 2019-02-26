#!/usr/bin/env bash

docker-compose up -d --force-recreate --remove-orphans

docker-compose ps
