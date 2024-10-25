# First stage: build
FROM node:20-bullseye-slim AS build

RUN mkdir -p /app
WORKDIR /app
RUN ls -l
COPY package*.json ./
RUN ls -l # Adicione isso para ver o que foi copiado
COPY package-lock*.json ./
RUN ls -l # Adicione isso para ver o que foi copiado
COPY . ./
RUN ls -l  # Adicione isso para ver todos os arquivos
RUN rm -Rf ./node_modules
RUN npm install

# Second stage: test
FROM build AS test
RUN npm test

# Final stage: runtime
FROM node:20-bullseye-slim
WORKDIR /app
COPY --from=build /app /app
CMD [ "node", "index.js" ]
