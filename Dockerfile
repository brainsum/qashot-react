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


FROM node:6.16.0-alpine as dist

# Pre-create workdir for proper permissions
RUN \
    mkdir -m 775 -p /home/node/src \
    && chown node:node /home/node -R

WORKDIR /home/node/src
USER node
CMD [ "yarn", "start" ]
EXPOSE 8080

COPY --chown=node --from=builder ["/home/node/src", "./"]
