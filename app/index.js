require('dotenv').config();

const express = require('express');
const app = express();
const axios = require('axios');
const pool = require('./postgresConfig');
const bcrypt = require('bcrypt');
const { generateToken, autenticarJWT } = require('./jwtConfig');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
require('./swagger');
const PORT = 8080;
const saltRounds = 10;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.post('/registrar', async (req, res) => {
    /*
    #swagger.tags = ['Registro']
    #swagger.summary = 'Registrar um novo usuário'
    #swagger.description = 'Endpoint para registrar um novo usuário.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Informações passadas pelo usuário para registro',
        required: true,
        schema: {
            nome: 'string',
            email: 'string',
            senha: 'string'
        }
    }
    #swagger.responses[201] = {
        description: 'Usuário registrado com sucesso!',
        schema: {
            "message": "Usuário registrado com sucesso!",
            "user": {
                "id": 14,
                "nome": "Cloud",
                "email": "cloud0@gmail.com"
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsIm5vbWUiOiJDbG91ZCIsImVtYWlsIjoiY2xvdWQwQGdtYWlsLmNvbSIsImlhdCI6MTcyOTE4OTM1NiwiZXhwIjoxNzI5MTkyOTU2fQ(...)"
        }
    }
    #swagger.responses[400] = {
        description: 'Erro de validação. Ou o valor passado como nome é nulo ou um dos parâmetros passou de 100 caracteres.'
    }

    #swagger.responses[409] = {
        description: 'Email já está em uso.'
    }
        
    #swagger.responses[500] = {
        description: 'Erro no servidor'
    }
    */

    const { nome, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ error: 'Nome não pode ser nulo.' });
    }
    if (nome.length > 100) {
        return res.status(400).json({ error: 'Nome estourou o limite de 100 caracteres.' });
    }
    if (email.length > 100) {
        return res.status(400).json({ error: 'Email estourou o limite de 100 caracteres.' });
    }
    if (senha.length > 100) {
        return res.status(400).json({ error: 'Senha estourou o limite de 100 caracteres.' });
    }

    try {
        console.log("Registrando usuário...");
        console.log("Senha: ", senha);
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        const result = await pool.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
            [nome, email, hashedPassword]
        );

        const { senha: _, ...usuarioSemSenha } = result.rows[0];
        
        console.log(usuarioSemSenha);

        const token = generateToken(usuarioSemSenha);

        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            user: usuarioSemSenha,
            token: token
        });
        
    } catch (err) {
        console.error(err);
    
        if (err.code === '23505') { 
            res.status(409).json({ error: 'Email já está em uso.' });
        } else {
            res.status(500).send('Erro no servidor');
        }
    }
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    /*
    #swagger.tags = ['Login']
    #swagger.summary = 'Realizar o login do usuário'
    #swagger.description = 'Endpoint para fazer o login do usuário.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Informações passadas pelo usuário para fazer o login',
        required: true,
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                senha: { type: 'string' }
            }
        }
    }
    #swagger.responses[200] = {
        description: 'Login do usuário realizado com sucesso!',
        schema: {
            "message": "Login realizado com sucesso!",
            "nome": "Cloud",
            "email": "cloud0@gmail.com",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsIm5vbWUiOiJDbG91ZCIsImVtYWlsIjoiY2xvdWQwQGdtYWlsLmNvbSIsImlhd(...)"
        }
    }

    #swagger.responses[401] = {
        description: 'Erro de email não encontrado ou senha incorreta.'
    }
        
    #swagger.responses[500] = {
        description: 'Erro no servidor'
    }
    */

    try {
        // Verificar se o email existe
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email não existe no sistema.' });
        }

        const usuario = result.rows[0];

        const isMatch = await bcrypt.compare(senha, usuario.senha);

        if (!isMatch) {
            return res.status(401).json({ error: 'Senha incorreta para esse endereço de email.' });
        }

        const token = generateToken(usuario);

        res.status(200).json({
            message: 'Login realizado com sucesso!',
            nome: usuario.nome,
            email: usuario.email,
            token: token
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.get('/consultar', autenticarJWT, async (req, res) => {

    /*
    #swagger.tags = ['Consultar']
    #swagger.summary = 'Consultar dados da NASA APOD'
    #swagger.description = 'Este endpoint permite consultar dados da NASA sobre o Astronomy Picture of the Day (APOD). É necessário autenticação JWT para acessar este recurso.'
    
    #swagger.parameters['Authorization'] = {
        in: 'header',
        description: 'Token JWT necessário para autenticação. O formato deve ser: Bearer {token}',
        required: true,
        type: 'string'
    }

    #swagger.responses[200] = {
        description: 'Dados consultados com sucesso!',
        schema: {
            message: 'Dados da NASA consultados com sucesso!',
            data: '2024-10-16',
            title: 'Astronomy Picture of the Day',
            url: 'https://apod.nasa.gov/apod/image/2410/picture.jpg',
            explanation: 'Explicação detalhada sobre a imagem do dia...',
            copyright: 'NASA'
        }
    }

    #swagger.responses[401] = {
        description: 'Token não fornecido ou inválido',
        schema: { message: 'Token não fornecido' }
    }

    #swagger.responses[403] = {
        description: 'Acesso negado - Token inválido',
        schema: { message: 'Token inválido' }
    }

    #swagger.responses[500] = {
        description: 'Erro interno no servidor',
        schema: { message: 'Erro ao consultar dados da NASA' }
    }
*/

    const apiKey =  process.env.API_KEY;
    try {
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
        

        res.status(200).json({
            message: 'Dados da NASA consultados com sucesso!',
            data: response.data.date,
            title: response.data.title,
            url: response.data.url,
            explanation: response.data.explanation,
            copyright: response.data.copyright
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro ao consultar dados Dados da NASA');
    }
});

