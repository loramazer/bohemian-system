// backend/models/clienteModel.js
const db = require('../config/db');

// Função para criar um novo cliente
async function create(cliente) {
  const { nome, email, telefone, senha } = cliente;
  const [result] = await db.execute(
    'INSERT INTO cliente (nome, email, telefone, senha) VALUES (?, ?, ?, ?)',
    // Se o telefone for uma string vazia, converte para null
    [nome, email, telefone || null, senha]
  );
  return result.insertId;
}

// Função para encontrar um cliente pelo e-mail
async function findByEmail(email) {
  const [rows] = await db.execute(
    'SELECT id_cliente, nome, email, senha FROM cliente WHERE email = ?',
    [email]
  );
  return rows[0];
}

module.exports = {
  create,
  findByEmail,
};
