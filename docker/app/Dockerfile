# Source code.
ARG SOURCE_CODE_IMAGE
ARG SOURCE_CODE_IMAGE_TAG
FROM ${SOURCE_CODE_IMAGE}:${SOURCE_CODE_IMAGE_TAG} as source-code


# Actual.
FROM php:7.2.15-fpm-alpine3.9

LABEL maintainer="mhavelant"

WORKDIR /var/www/html

ARG SOURCE_CODE_IMAGE
ARG SOURCE_CODE_IMAGE_TAG

ENV \
    SOURCE_CODE_IMAGE=${SOURCE_CODE_IMAGE} \
    SOURCE_CODE_IMAGE_TAG=${SOURCE_CODE_IMAGE_TAG}

# Use the default production configuration
USER root
RUN mv "${PHP_INI_DIR}/php.ini-production" "${PHP_INI_DIR}/php.ini"

USER www-data

COPY --from=source-code --chown=www-data:www-data ["/qashot-react/build", "/var/www/html"]
