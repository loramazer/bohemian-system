// models/itemCarrinhoModel.js

const db = require('../config/db');


exports.adicionarItem = async (id_carrinho, produto_id, quantidade, preco_unitario) => {
  const selectSql = 'SELECT * FROM item_carrinho WHERE id_carrinho = ? AND id_produto = ?';
  const [rows] = await db.execute(selectSql, [id_carrinho, produto_id]);

  if (rows.length > 0) {
    console.log(`[itemCarrinhoModel] Produto ${produto_id} JÁ EXISTE. Atualizando quantidade.`); // Seu log
    const itemExistente = rows[0];
    const novaQuantidade = itemExistente.quantidade + quantidade;
    
    // A query SQL (UPDATE) está correta
    const updateSql = 'UPDATE item_carrinho SET quantidade = ? WHERE id_item_carrinho = ?';
    
    // --- CORREÇÃO AQUI ---
    // Mude de 'itemExistente.item_id_carrinho' para 'itemExistente.id_item_carrinho'
    await db.execute(updateSql, [novaQuantidade, itemExistente.id_item_carrinho]);
    // ---------------------

  } else {
    console.log(`[itemCarrinhoModel] Produto ${produto_id} NÃO EXISTE. Inserindo novo item.`); // Seu log
    const insertSql = 'INSERT INTO item_carrinho (id_carrinho, id_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?)';
    await db.execute(insertSql, [id_carrinho, produto_id, quantidade, preco_unitario]);
  }
};


exports.listarItens = async (id_carrinho) => {
  // --- CORREÇÃO: Adicionado 'p.id_produto' ---
  const sql = `SELECT ic.id_item_carrinho, ic.quantidade, ic.preco_unitario, p.id_produto, p.nome AS nome_produto,p.imagem_url FROM item_carrinho ic JOIN produto p ON ic.id_produto = p.id_produto WHERE ic.id_carrinho = ?;`;
  const [rows] = await db.execute(sql, [id_carrinho]);
  return rows;
};

exports.esvaziar = async (id_carrinho) => {
  const sql = 'DELETE FROM item_carrinho WHERE id_carrinho = ?';
  await db.execute(sql, [id_carrinho]);
};

exports.atualizarQuantidade = async (id_item_carrinho, novaQuantidade) => {
  const sql = 'UPDATE item_carrinho SET quantidade = ? WHERE id_item_carrinho = ?';
  await db.execute(sql, [novaQuantidade, id_item_carrinho]);
};


exports.removerItem = async (id_item_carrinho) => {
  const sql = 'DELETE FROM item_carrinho WHERE id_item_carrinho = ?';
  await db.execute(sql, [id_item_carrinho]);
};