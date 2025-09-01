const db = require('../config/db');

// FUNÇÃO ATUALIZADA E CORRIGIDA
exports.adicionarItem = async (carrinho_id, produto_id, quantidade, preco_unitario) => {
  // 1. Verifica se o item já existe no carrinho
  const selectSql = 'SELECT * FROM item_carrinho WHERE carrinho_id = ? AND produto_id = ?';
  const [rows] = await db.execute(selectSql, [carrinho_id, produto_id]);

  if (rows.length > 0) {
    // 2. Se o item JÁ EXISTE, atualiza a quantidade
    const itemExistente = rows[0];
    // Soma a quantidade que já estava no carrinho com a nova
    const novaQuantidade = itemExistente.quantidade + quantidade;
    const updateSql = 'UPDATE item_carrinho SET quantidade = ? WHERE item_carrinho_id = ?';
    await db.execute(updateSql, [novaQuantidade, itemExistente.item_carrinho_id]);

  } else {
    // 3. Se o item NÃO EXISTE, insere uma nova linha
    const insertSql = 'INSERT INTO item_carrinho (carrinho_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)';
    await db.execute(insertSql, [carrinho_id, produto_id, quantidade, preco_unitario]);
  }
};


// Função de listar (permanece igual)
exports.listarItens = async (carrinho_id) => {
  const sql = `
    SELECT
      ic.item_carrinho_id,
      p.nome,
      ic.quantidade,
      ic.preco_unitario,
      (ic.quantidade * ic.preco_unitario) AS subtotal
    FROM item_carrinho ic
    JOIN produto p ON ic.produto_id = p.id_produto
    WHERE ic.carrinho_id = ?
  `;
  const [rows] = await db.execute(sql, [carrinho_id]);
  return rows;
};

exports.removerItem = async (itemId) => {
  await db.query("DELETE FROM item_carrinho WHERE item_carrinho_id = ?", [itemId]);
};