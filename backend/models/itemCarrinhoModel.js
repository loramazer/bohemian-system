const db = require('../config/db');

exports.adicionarItem = async (id_carrinho, produto_id, quantidade, preco_unitario) => {
  const selectSql = 'SELECT * FROM item_carrinho WHERE id_carrinho = ? AND id_produto = ?';
  const [rows] = await db.execute(selectSql, [id_carrinho, produto_id]);

  if (rows.length > 0) {
    const itemExistente = rows[0];
    const novaQuantidade = itemExistente.quantidade + quantidade;
    const updateSql = 'UPDATE item_carrinho SET quantidade = ? WHERE item_id_carrinho = ?';
    await db.execute(updateSql, [novaQuantidade, itemExistente.item_id_carrinho]);
  } else {
    const insertSql = 'INSERT INTO item_carrinho (id_carrinho, id_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?)';
    await db.execute(insertSql, [id_carrinho, produto_id, quantidade, preco_unitario]);
  }
};

exports.listarItens = async (id_carrinho) => {
  const sql = `
    SELECT
      ic.id_item_carrinho,
      ic.quantidade,
      ic.preco_unitario,
      p.nome AS nome_produto,
      p.imagem_url
    FROM
      item_carrinho ic
    JOIN
      produto p ON ic.id_produto = p.id_produto
    WHERE
      ic.id_carrinho = ?;
  `;
  const [rows] = await db.execute(sql, [id_carrinho]);
  return rows;
};

exports.esvaziar = async (id_carrinho) => {
  const sql = 'DELETE FROM item_carrinho WHERE id_carrinho = ?';
  await db.execute(sql, [id_carrinho]);
};