### builder-stage
FROM node:14.16.0-alpine3.13 as build-stage

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --loglevel silly

# Build application
COPY . ./
RUN npm run build:commonjs:dev

### production-stage
FROM node:14.16.0-alpine3.13 as production-stage

WORKDIR /var/www

# Update base image
RUN set -xe && \
  apk add --no-cache --update && \
  rm -rf /tmp/* /usr/local/lib/php/doc/* /var/cache/apk/*

# Install server dependencies
RUN npm install express morgan --loglevel silly

COPY --from=build-stage /app/dist ./dist/
COPY --from=build-stage /app/server.js ./

ENTRYPOINT [ "node", "server.js" ]
CMD [ "" ]

EXPOSE 3000
