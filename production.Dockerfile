ARG NODE_VERSION=lts-alpine

FROM node:${NODE_VERSION} as BUILDER

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --loglevel silly

# Build application
COPY . ./
RUN npm run build:commonjs:dev


FROM node:${NODE_VERSION}

WORKDIR /var/www

# Update base image
RUN set -xe && \
  apk add --no-cache --update && \
  rm -rf /tmp/* /var/cache/apk/*

# Install server dependencies
RUN npm install express morgan --loglevel silly

COPY --from=BUILDER /app/dist ./dist/
COPY --from=BUILDER /app/server.js ./

ENTRYPOINT [ "node", "server.js" ]
CMD [ "" ]

EXPOSE 3000
