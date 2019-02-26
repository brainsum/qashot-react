# Build.
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
FROM scratch as actual

LABEL maintainer="mhavelant"

WORKDIR /qashot-react/build

COPY --from=builder --chown=1000:1000 ["/home/node/src/build", "/qashot-react/build"]

VOLUME "/qashot-react/build"

USER 1000
