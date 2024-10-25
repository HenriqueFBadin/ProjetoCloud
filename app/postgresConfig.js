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

// Função para criar a tabela se ela não existir
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      senha VARCHAR(255) NOT NULL
    );
  `;

  try {
    await pool.query(query);
    console.log("Tabela 'usuarios' criada ou já existe.");
  } catch (error) {
    console.error("Erro ao criar a tabela:", error);
  }
};

// Função para inicializar o banco de dados
const initDatabase = async () => {
  await createTable();
};

// Função principal para inicializar a conexão e o banco de dados
const main = async () => {
  try {
    // Testa a conexão com o banco de dados
    await pool.connect();
    console.log("Conexão com o banco de dados estabelecida.");

    // Inicializa o banco de dados
    await initDatabase();
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
};

// Chama a função principal
main();

// Exporta o pool para uso em outras partes do aplicativo
module.exports = pool;
