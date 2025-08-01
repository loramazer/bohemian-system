const db = require('../config/db');

async function criarCliente(nome, email, telefone, senhaCriptografada) {
  const [result] = await db.execute(
    'INSERT INTO cliente (nome, email, telefone, senha) VALUES (?, ?, ?, ?)',
    [nome, email, telefone, senhaCriptografada]
  );
  return result.insertId;
}

async function buscarClientePorEmail(email) {
  const [rows] = await db.execute('SELECT * FROM cliente WHERE email = ?', [email]);
  return rows[0];
}

module.exports = {
  criarCliente,
  buscarClientePorEmail,
};
