const db = require("../config/db");

exports.adicionarItem = async (carrinhoId, produtoId, quantidade, preco) => {
  await db.query(
    `INSERT INTO item_carrinho (carrinho_id, produto_id, quantidade, preco_unitario)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade)`,
    [carrinhoId, produtoId, quantidade, preco]
  );
};

exports.removerItem = async (itemId) => {
  await db.query("DELETE FROM item_carrinho WHERE item_carrinho_id = ?", [itemId]);
};

exports.listarItens = async (carrinhoId) => {
  const [rows] = await db.query(
    `SELECT i.item_carrinho_id, p.nome, i.quantidade, i.preco_unitario,
            (i.quantidade * i.preco_unitario) AS subtotal
     FROM item_carrinho i
     JOIN produtos p ON p.produto_id = i.produto_id
     WHERE i.carrinho_id = ?`,
    [carrinhoId]
  );
  return rows;
};
