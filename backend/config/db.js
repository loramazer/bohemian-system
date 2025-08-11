const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados:', err);
    throw err; // Lança o erro para parar a aplicação se não conseguir conectar
  }
  console.log('MySQL conectado com sucesso!');
  connection.release(); // Importante: devolve a conexão para o pool
});

module.exports = pool.promise();
