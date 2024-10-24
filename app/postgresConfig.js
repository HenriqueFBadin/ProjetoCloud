const { Pool } = require('pg');
console.log("Conectando ao banco de dados");
console.log("Usuário: ", process.env.POSTGRES_USER);
console.log("Senha: ", process.env.POSTGRES_PASSWORD);
console.log("Banco de dados: ", process.env.POSTGRES_DB);
console.log("Host: db");
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'db',
  password: process.env.POSTGRES_PASSWORD, 
  database: process.env.POSTGRES_DB,
  port: 5432, 
});

module.exports = pool;