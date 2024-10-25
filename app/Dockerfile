# First stage: build
FROM node:20-bullseye-slim as build

RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./app/
COPY package-lock*.json ./app/
COPY . ./
RUN rm -Rf ./node_modules
RUN npm install

# Second stage: test
FROM build as test
RUN npm test

# Final stage: runtime
FROM node:20-bullseye-slim
WORKDIR /app
COPY --from=build /app /app
CMD [ "node", "index.js" ]