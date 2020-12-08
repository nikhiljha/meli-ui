FROM nginx:1.17-alpine

COPY docker/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
COPY docker/env.js /env.js

RUN apk --no-cache add \
    bash \
    nodejs \
  && chmod +x /docker-entrypoint.sh /env.js

COPY ./build /www

LABEL maintainer="meli.sh"

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
