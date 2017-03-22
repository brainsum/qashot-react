# See https://medium.com/@iamnayr/a-multi-part-analysis-of-node-docker-image-sizes-using-yarn-vs-traditional-npm-2c20f034c08f#.epj37e3wa
FROM node:6.10-alpine

#USER node

# Create app directory.
RUN mkdir /home/node/src
WORKDIR /home/node/src

# Caching trick thingy.
COPY package.json .
COPY yarn.lock .

# Copy source code to
COPY . .

# Install deps.
RUN yarn && \
    yarn run build && \
    yarn cache clean

# Run app.
CMD [ "yarn", "start" ]

EXPOSE 8080