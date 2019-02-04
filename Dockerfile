FROM node:6.16.0-alpine as builder

WORKDIR /home/node/src

COPY ["scripts/", "./scripts"]
COPY ["package.json", "yarn.lock", "./"]

RUN apk add --update --no-cache \
        python=2.7.15-r1 \
    && chown node:node . -R

USER node

RUN \
    yarn install

COPY . .

RUN \
    yarn run build \
    && yarn cache clean

# Actual
FROM pagespeed/nginx-pagespeed:1.13.35-alpine3.8-ngx1.15

LABEL maintainer="mhavelant"

WORKDIR /var/www/

COPY --from=builder --chown=nginx:nginx ["/home/node/src/build", "/var/www/build"]
COPY ["docker/nginx_config/nginx.conf", "/etc/nginx/conf.d/default.conf"]
COPY ["docker/nginx_config/additional", "/etc/nginx/additional"]

EXPOSE 80

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
