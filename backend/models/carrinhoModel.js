const db = require("../config/db");

exports.criarCarrinho = async (clienteId) => {
  const [result] = await db.query(
    "INSERT INTO carrinho (cliente_id) VALUES (?)",
    [clienteId]
  );
  return result.insertId;
};

exports.buscarCarrinhoAtivo = async (clienteId) => {
  const [rows] = await db.query(
    "SELECT * FROM carrinho WHERE cliente_id = ? AND status = 'ATIVO' LIMIT 1",
    [clienteId]
  );
  return rows[0];
};

exports.atualizarStatus = async (carrinhoId, status) => {
  await db.query(
    "UPDATE carrinho SET status = ? WHERE carrinho_id = ?",
    [status, carrinhoId]
  );
};
