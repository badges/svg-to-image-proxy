FROM node:10-alpine

RUN apk add --no-cache gettext imagemagick librsvg

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY package.json package-lock.json /usr/src/app/
RUN npm ci --only=production

COPY . /usr/src/app

CMD node_modules/.bin/micro

EXPOSE 3000
