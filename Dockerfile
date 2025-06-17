FROM node:18-alpine

ARG NODE_ENV
ARG NODE_PORT

ENV NODE_PORT ${NODE_PORT}
ENV NODE_ENV ${NODE_ENV}
ENV TZ="Asia/Bangkok"

RUN mkdir -p /app

WORKDIR /app

COPY . ./

COPY .env.${NODE_ENV} ./.env

RUN yarn install
RUN yarn build

EXPOSE ${NODE_PORT}
