FROM nginx:alpine-slim

#RUN apk add --update --no-cache nginx-mod-http-brotli

COPY docker/ /
COPY dist/ /usr/share/nginx/html/
