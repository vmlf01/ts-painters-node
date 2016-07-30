FROM smebberson/alpine-nodejs
MAINTAINER Vitor Fernandes <vmlf01@gmail.com>

# Build the npm modules.
ADD ./package.json /app/package.json
RUN cd /app && npm install --production

# Add the remaining source (excluding `root/app/node_modules` thanks to `.dockerignore`).
ADD ./start /app
ADD ./config /app/config
ADD ./lib/js/src /app/lib/js/src

CMD ["/app/start"]
