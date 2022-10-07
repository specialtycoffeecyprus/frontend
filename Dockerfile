FROM pierrezemb/gostatic
COPY docker/config/headerConfig.json /config/
COPY dist/ /srv/http/
ENTRYPOINT ["/goStatic", "-fallback", "/index.html"]
