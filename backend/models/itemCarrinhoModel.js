const db = require('../config/db');

exports.adicionarItem = async (carrinho_id, produto_id, quantidade, preco_unitario) => {
  const selectSql = 'SELECT * FROM item_carrinho WHERE carrinho_id = ? AND produto_id = ?';
  const [rows] = await db.execute(selectSql, [carrinho_id, produto_id]);

  if (rows.length > 0) {
    const itemExistente = rows[0];
    const novaQuantidade = itemExistente.quantidade + quantidade;
    const updateSql = 'UPDATE item_carrinho SET quantidade = ? WHERE item_carrinho_id = ?';
    await db.execute(updateSql, [novaQuantidade, itemExistente.item_carrinho_id]);
  } else {
    const insertSql = 'INSERT INTO item_carrinho (carrinho_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)';
    await db.execute(insertSql, [carrinho_id, produto_id, quantidade, preco_unitario]);
  }
};

exports.listarItens = async (carrinho_id) => {
  const sql = `
    SELECT
      ic.item_carrinho_id,
      ic.quantidade,
      ic.preco_unitario,
      p.nome AS nome_produto,
      p.imagem_url
    FROM
      item_carrinho ic
    JOIN
      produto p ON ic.produto_id = p.id_produto
    WHERE
      ic.carrinho_id = ?;
  `;
  const [rows] = await db.execute(sql, [carrinho_id]);
  return rows;
};

exports.esvaziar = async (carrinho_id) => {
  const sql = 'DELETE FROM item_carrinho WHERE carrinho_id = ?';
  await db.execute(sql, [carrinho_id]);
};