# Actual.
FROM pagespeed/nginx-pagespeed:1.13.35.2-alpine3.8-ngx1.15

LABEL maintainer="mhavelant"

WORKDIR /var/www/html

COPY ["nginx_config/nginx.conf", "/etc/nginx/conf.d/default.conf"]
COPY ["nginx_config/additional/", "/etc/nginx/additional/"]
