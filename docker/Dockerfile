FROM nginx:1.17-alpine

COPY docker/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.sh /entrypoint.sh
COPY docker/env.sh /env.sh

RUN chmod +x /entrypoint.sh /env.sh

COPY ./build /www

LABEL maintainer="meli.sh"

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
