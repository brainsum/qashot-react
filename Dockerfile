# Build.
FROM node:10.15.1-alpine as builder

ENV PATH="/home/node/app/node_modules/.bin:$PATH"

WORKDIR /home/node/app

COPY ["package.json", "package-lock.json", "./"]

RUN apk add --update --no-cache \
        python=2.7.15-r1 \
    && chown node:node . -R

USER node

RUN \
    npm ci && \
    npm cache -g clean --force

COPY . .

RUN npm run build


# Actual.
FROM php:7.2.15-fpm-alpine3.9

LABEL maintainer="mhavelant"

WORKDIR /var/www/html
VOLUME /var/www/html

# Use the default production configuration
USER root
RUN mv "${PHP_INI_DIR}/php.ini-production" "${PHP_INI_DIR}/php.ini"

USER www-data

COPY --from=builder --chown=www-data:www-data ["/home/node/app/build", "/var/www/html"]
