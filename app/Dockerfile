#FROM ubuntu:22.04
FROM node:20-bullseye-slim

RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
COPY package-lock*.json ./
COPY . ./
RUN rm -Rf ./node_modules
RUN npm install

# ENTRYPOINT [ "tail", "-f", "/dev/null" ]
CMD [ "node", "index.js" ]    