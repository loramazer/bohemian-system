const db = require("../config/db");

exports.criarCarrinho = async (usuarioId) => {
  const [result] = await db.query(
    "INSERT INTO carrinho (id_usuario) VALUES (?)",
    [usuarioId]
  );
  return result.insertId;
};

exports.buscarCarrinhoAtivo = async (usuarioId) => {
  const [rows] = await db.query(
    "SELECT * FROM carrinho WHERE id_usuario = ? AND status = 'ATIVO' LIMIT 1",
    [usuarioId]
  );
  return rows[0];
};

exports.atualizarStatus = async (carrinhoId, status) => {
  await db.query(
    "UPDATE carrinho SET status = ? WHERE carrinho_id = ?",
    [status, carrinhoId]
  );
};
