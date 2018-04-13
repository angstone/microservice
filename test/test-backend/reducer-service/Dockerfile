FROM node:9.3.0-alpine
MAINTAINER SS Ribeiro

USER node
ENV NODE_ENV production
VOLUME /home/node/app
WORKDIR /home/node/app

CMD sleep 2 \
 && rm -f ../.forever/*.log \
 && $(npm bin)/forever start -w --minUptime 10 --spinSleepTime 1000 test/test-backend/reducer-service/index.js \
 && tail -f ../.forever/*.log
