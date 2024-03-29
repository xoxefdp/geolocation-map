ARG NODE_IMAGE_VERSION=lts-alpine

FROM node:${NODE_IMAGE_VERSION}

# Set working directory
WORKDIR /var/www

# Update base image
RUN set -xe && \
  apk add --no-cache --update && \
  rm -rf /tmp/* /var/cache/apk/*

# ENTRYPOINT [ "npm", "run", "serve:commonjs:dev" ]
CMD [ "npm", "run", "serve:browsers:dev" ]

EXPOSE 3000

VOLUME [ "/var/www" ]
