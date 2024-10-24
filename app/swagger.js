const swaggerAutogen = require('swagger-autogen')();
const outputFile = './swagger-output.json';
const routes = ['./index.js'];
const doc = {
    info: {
        title: 'MY API',
        description: 'API de cloud',
        version: '1.0.0'
    },
    host: 'localhost:8080',
    definitions: {
        Registro: {
            "type": "object",
            "properties": {
              "message": {
                "type": "string",
                "example": "Usuário registrado com sucesso!"
              },
              "user": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "integer",
                    "example": 13
                  },
                  "nome": {
                    "type": "string",
                    "example": "Exemplos"
                  },
                  "email": {
                    "type": "string",
                    "example": "Exemplos.com.br@gmail.com"
                  }
                }
              },
              "token": {
                "type": "string",
                "description": "Token JWT gerado para autenticação do usuário. Este token deve ser usado em requisições subsequentes para acessar rotas protegidas da API.",
                "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsIm5vbWUiOiJFeGVtcGxvcyIsImVtYWlsIjoiRXhlbXBsb3MuY29tLmJyQGdtYWlsLmNvbSIsImlhdCI6MT(...)"
              }
            }
          },
        
          Login: {
            "type": "object",
            "properties": {
              "message": {
                "type": "string",
                "description": "Mensagem de retorno do endpoint",
                "example": "Login registrado com sucesso!"
              },
              "nome": {
                "type": "string",
                "description": "Nome do usuário",
                "example": "Example da Silva"
              },
              "email": {
                "type": "string",
                "description": "Email do usuário",
                "example": "Exemplos.com.br@gmail.com"
              },
              "token": {
                "type": "string",
                "description": "Token JWT gerado para autenticação do usuário. Este token deve ser usado em requisições subsequentes para acessar rotas protegidas da API.",
                "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsIm5vbWUiOiJFeGVtcGxvcyIsImVtYWlsIjoiRXhlbXBsb3MuY29tLmJyQGdtYWlsLmNvbSIsImlhdCI6MT(...)"
              }
            }
          },

          Consultar: {
            "type": "object",
            "properties": {
              "message": {
                "type": "string",
                "description": "Mensagem de retorno do endpoint",
                "example": "Dados da NASA consultados com sucesso!"
              },
              "data": {
                "type": "string",
                "description": "Data da consulta realizada pelo usuário",
                "example": "17/10/2024"
              },
              "title": {
                "type": "string",
                "description": "título do arquivo consultado pelo usuário",
                "example": "Título do arquivo"
              },
              "url": {
                "type": "string",
                "description": "URL do arquivo consultado pelo usuário",
                "example": "https://api.nasa.gov/planetary/apod(...)"
              },
              "explanation": {
                "type": "string",
                "description": "Explicação do arquivo consultado pelo usuário",
                "example": "Explicação do arquivo"
              },
              "copyright": {
                "type": "string",
                "description": "Direitos autorais do arquivo consultado pelo usuário",
                "example": "Direitos autorais do arquivo"
              }
            }
          }
        },
    basePath: '/',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    // securityDefinitions: {
    //     Bearer: {
    //         type: 'apiKey',
    //         name: 'Authorization',
    //         in: 'header',
    //         description: 'Token JWT no formato: Bearer <token>'
    //     }
    // }
};

swaggerAutogen(outputFile, routes, doc);