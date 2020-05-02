FROM node:10

ADD . /app

WORKDIR /app

RUN npm install

USER node

CMD [ "./cmd.sh" ]
