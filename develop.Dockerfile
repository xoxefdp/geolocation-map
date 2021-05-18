FROM node:14.16.0-alpine3.13

# Set working directory
WORKDIR /var/www

# Update base image
RUN set -xe && \
  apk add --no-cache --update && \
  rm -rf /tmp/* /var/cache/apk/*

# ENTRYPOINT [ "npm", "run", "serve:commonjs:dev" ]
CMD [ "npm", "run", "serve:commonjs:dev" ]

EXPOSE 3000

VOLUME [ "/var/www" ]
