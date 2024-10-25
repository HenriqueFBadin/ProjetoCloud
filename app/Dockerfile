# First stage: build
FROM node:20-bullseye-slim AS build

RUN mkdir -p /app
WORKDIR /app

# Liste os arquivos no contexto de build antes da cópia
RUN echo "Arquivos no contexto de build:" && ls -la /app

COPY package*.json ./

# Verifique o que foi copiado
RUN echo "Após copiar os arquivos JSON:" && ls -la .

# Continue com o restante do Dockerfile
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
