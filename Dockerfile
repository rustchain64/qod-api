FROM registry.redhat.io/rhel8/nodejs-16

ENV APP_ROOT=/opt/app-root

WORKDIR $APP_ROOT

COPY server.js .
COPY package.json .

RUN npm install

EXPOSE 8080

CMD ["node", "server.js"]
