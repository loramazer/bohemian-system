// backend/models/clienteModel.js
const db = require('../config/db');

// Função para criar um novo cliente
async function criarCliente(cliente) {
  const { nome, email, telefone, senha } = cliente;
  const [result] = await db.execute(
    'INSERT INTO cliente (nome, email, telefone, senha) VALUES (?, ?, ?, ?)',
    // Se o telefone for uma string vazia, converte para null
    [nome, email, telefone || null, senha]
  );
  return result.insertId;
}

// Função para encontrar um cliente pelo e-mail
async function buscarClientePorEmail(email) {
  const [rows] = await db.execute(
    'SELECT id_cliente, nome, email, senha FROM cliente WHERE email = ?',
    [email]
  );
  return rows[0];
}

function salvarTokenRecuperacao(id_cliente, token, expires) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE cliente SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id_cliente = ?';
    db.query(query, [token, expires, id_cliente], (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
}

function buscarClientePorToken(token) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM cliente WHERE resetPasswordToken = ? AND resetPasswordExpires > ?';
    db.query(query, [token, Date.now()], (error, results) => {
      if (error) return reject(error);
      resolve(results[0]);
    });
  });
}

function atualizarSenhaCliente(id_cliente, novaSenhaCriptografada) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE cliente SET senha = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id_cliente = ?';
    db.query(query, [novaSenhaCriptografada, id_cliente], (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
}

module.exports = {
  criarCliente,
  buscarClientePorEmail,
  salvarTokenRecuperacao,
  buscarClientePorToken,
  atualizarSenhaCliente,
};
