FROM node:lts-alpine

COPY . /app

WORKDIR /app

RUN npm install

RUN npm run build

USER node

CMD [ "npm", "start" ]
