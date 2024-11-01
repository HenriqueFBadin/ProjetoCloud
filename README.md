# Projeto 1 de Cloud - Docker e API

## Nome do Aluno

Henrique F. Badin

# Explicação do Projeto

Este projeto é uma API que permite o cadastro, login e consulta de imagens do espaço, obtidas aleatoriamente a partir de uma API da NASA. Desenvolvido com Node.js, a aplicação gerencia usuários em um banco de dados PostgreSQL em um container Docker.

# Como Executar a Aplicação

Para rodar a aplicação, siga estes passos:

1. **Baixe o arquivo compose.yml:**
   <a href="https://raw.githubusercontent.com/HenriqueFBadin/ProjetoCloud/main/compose.yml" id="donwload">
   <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
   Baixar compose.yml
   </button>
   </a>

<script>
document.getElementById('download').addEventListener('click', function(event) {
    event.preventDefault();
    const url = this.href;
    const fileName = 'compose.yml';

    fetch(url)
    .then(response => response.blob())
    .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    })
    .catch(() => alert('Erro'));
});
</script>

2. **Execute o Docker Compose:**
   Certifique-se de ter o Docker e o Docker Compose instalados. Execute o docker. Após isso, execute o comando abaixo no terminal CMD, no diretório onde o arquivo `compose.yaml` está localizado:
   ```
   docker compose up -d
   ```
3. **Acesse a aplicação:**
   A aplicação estará disponível em `http://localhost:8080`, conforme configurado no `compose.yaml`.

# Documentação dos Endpoints

### POST /registrar

Registra um novo usuário.

**Request**

```json
{
  "nome": "Disciplina Cloud",
  "email": "cloud@insper.edu.br",
  "senha": "cloud0"
}
```

**Response**

- **_resposta positiva (201)_**

```json
{
  "message": "Usuário registrado com sucesso!",
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tZSI6IkRpc2NpcGxpbmEgQ2xvdWQiLCJlbWFpbCI6ImNsb3VkQGluc3Blci5lZHUuYnIiLCJpYXQiOjE3MzA0MDg5MzgsImV4cCI6MTczMDQxMjUzOH0.fe5qVKSO5oaQY-U9iVfFR7oRteB2J_N51BAArC_PJRA"
}
```

- **_resposta caso o nome esteja em branco (400)_**

```json
{
  "error": "Nome não pode ser nulo."
}
```

- **_resposta caso um dos parâmetros exceda o limite de caracteres (400)_**

```json
{
  "error": "Nome/Email/Senha estourou o limite de caracteres."
}
```

- **_resposta caso o email já esteja cadastrado (409)_**

```json
{
  "error": "Email já está em uso."
}
```

- **_resposta para erro no servidor (500)_**

```json
{
  "error": "Erro no servidor."
}
```

### POST /login

Autentica o usuário registrado.

**Request**

```json
{
  "email": "cloud@insper.edu.br",
  "senha": "cloud0"
}
```

**Response**

- **_resposta positiva (200)_**

```json
{
  "message": "Login realizado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsIm5vbWUiOiJDbG91ZCIsImVtYWlsIjoiY2xvdWQwQGdtYWlsLmNvbSIsImlhd(...)"
}
```

- **_resposta caso o email não esteja registrado no sistema (401)_**

```json
{
  "error": "Email não existe no sistema."
}
```

- **_resposta caso a senha esteja incorreta (401)_**

```json
{
  "error": "Senha incorreta para esse endereço de email."
}
```

- **_resposta para erro no servidor (500)_**

```json
{
  "error": "Erro no servidor."
}
```

### GET /consultar

Esse endpoint consulta faz uma consulta na API da NASA e retorna a imagem do dia. Todo dia uma nova imagem é retornada.

**Headers**

- `Authorization: Bearer <JWT>`

**Response**

_**resposta positiva (200)**_

```json
{
  "message": "Dados da NASA consultados com sucesso!",
  "data": "2024-10-16",
  "title": "Astronomy Picture of the Day",
  "url": "https://apod.nasa.gov/apod/image/2410/picture.jpg",
  "explanation": "Explicação detalhada sobre a imagem do dia...",
  "copyright": "NASA"
}
```

_**resposta de erro na requisição (500)**_

```json
{
  "error": "Erro ao consultar dados Dados da NASA."
}
```

# Testando a API

---

Para interagir com a API, você pode utilizar o Postman ou o terminal CMD do diretório com cURL. Além disso, é possível utilizar o swagger da API no endpoint `/docs`. Recomendo o uso do Postman para uma melhor visualização das respostas.

### Usando o Postman

1.  **Instale o Postman**: Se ainda não o possui, faça o download e instale o Postman aqui.
2.  **Realize as requisições**: Use as informações dos endpoints documentados abaixo para realizar suas requisições.

### Usando cURL

Se preferir usar o terminal do windows, o CMD, você pode usar cURL para fazer as requisições. Aqui estão alguns exemplos de como você pode testar os endpoints:

- **Registrar um novo usuário:**

Copiar código e adaptá-lo

`curl -X POST http://localhost:8080/registrar -H "Content-Type: application/json" -d "{\"nome\": \"<Seu nome>\",\"email\": \"<Seu email>\", \"senha\": \"<Sua senha>\"}"`

- **Login do usuário:**

Copiar código e adaptá-lo

`curl -X POST http://localhost:8080/login -H "Content-Type: application/json" -d "{\"email\": \"<Seu email>\", \"senha\": \"<Sua senha>\"}"`

- **Consultar uma imagem do espaço:**

Copiar código e adaptá-lo

`curl -X GET http://localhost:8080/consultar -H "Authorization: Bearer <Seu JWT>"`

Substitua os parâmetros como `<Seu nome>` pelo seu próprio nome e `<JWT>` pelo token obtido após o login.

# Vídeo de Execução

Veja um vídeo curto de execução da aplicação [aqui](https://youtu.be/WbELbTJkU0w).

# Docker Hub

Imagem disponível no Docker Hub: [Link para Docker Hub](https://hub.docker.com/layers/henriquefb/henriquesproject/final-version/images/sha256-2bfee1ece6d4eebd63ee528b5e5696711f9e799889fb2e59f3d25316942f9153?context=repo)

# Arquivo Compose.yaml caso a instalação pelo botão não funcione

O arquivo `compose.yaml` está localizado na raiz do projeto `https://github.com/HenriqueFBadin/ProjetoCloud`. Caso não consiga instalá-lo pelo botão, busque-o nesse repositório. Ele utiliza imagens do Docker Hub e configura o PostgreSQL e a API para que não haja necessidade de builds adicionais.

```

```
