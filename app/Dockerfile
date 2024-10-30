# First stage: build
FROM node:slim AS build
RUN mkdir -p /app
WORKDIR /app

# Liste os arquivos no contexto de build antes da cópia
RUN apt update && apt install -y postgresql-client
COPY package.json ./
COPY package-lock.json ./

COPY . ./
# Continue com o restante do Dockerfile
RUN rm -Rf ./node_modules
RUN npm install

# Second stage: test
FROM build AS test
RUN npm test

# Final stage: runtime
FROM node:slim
WORKDIR /app
COPY --from=build /app /app
CMD [ "node", "index.js" ]
