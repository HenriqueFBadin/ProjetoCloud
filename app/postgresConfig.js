const { Pool, Client } = require('pg');
console.log("Conectando ao banco de dados");
console.log(`Banco de dados: ${process.env.POSTGRES_DB}: `, process.env.POSTGRES_DB == "projeto");
console.log(`Usuário: ${process.env.POSTGRES_USER}: `, process.env.POSTGRES_USER == "projeto");
console.log(`Senha: ${process.env.POSTGRES_PASSWORD}: `, process.env.POSTGRES_PASSWORD == "projeto");
console.log(`Host: ${process.env.POSTGRES_HOST}: `, process.env.POSTGRES_HOST == "db");

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432,
// database: "projeto",
// user: "projeto",
// host: 'db',
// password: "cloud",
// port: 5432,
});

module.exports = pool;
