FROM node:18-alpine

COPY package.json /app/package.json
COPY . /app

RUN cd /app && yarn install && yarn prebuild && yarn build

WORKDIR /app

CMD ["npm",  "start"]

EXPOSE 3000
