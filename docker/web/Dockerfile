# Source code.
ARG SOURCE_CODE_IMAGE
ARG SOURCE_CODE_IMAGE_TAG
FROM ${SOURCE_CODE_IMAGE}:${SOURCE_CODE_IMAGE_TAG} as source-code


# Actual.
FROM pagespeed/nginx-pagespeed:1.13.35.2-alpine3.8-ngx1.15

LABEL maintainer="mhavelant"

WORKDIR /var/www/html

ARG SOURCE_CODE_IMAGE
ARG SOURCE_CODE_IMAGE_TAG

ENV \
    SOURCE_CODE_IMAGE=${SOURCE_CODE_IMAGE} \
    SOURCE_CODE_IMAGE_TAG=${SOURCE_CODE_IMAGE_TAG}

COPY ["nginx_config/nginx.conf", "/etc/nginx/conf.d/default.conf"]
COPY ["nginx_config/additional/", "/etc/nginx/additional/"]

COPY --from=source-code --chown=nginx:nginx ["/qashot-react/build", "/var/www/html"]
