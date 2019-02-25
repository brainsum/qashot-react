FROM node:10.15.1-alpine as builder

WORKDIR /home/node/src

COPY ["package.json", "package-lock.json", "./"]

RUN apk add --update --no-cache \
        python=2.7.15-r1 \
    && chown node:node . -R

USER node

RUN \
    npm ci && \
    npm cache -g clean --force

COPY . .

RUN \
    npm run build

# Actual
FROM php:7.2.15-fpm-alpine3.9

LABEL maintainer="mhavelant"

WORKDIR /var/www/html

COPY --from=builder --chown=www-data:www-data ["/home/node/src/build", "/var/www/html"]

USER www-data
