const db = require('../config/db');

// Manteremos as suas funções com os nomes originais em português

// Buscar todos os produtos
async function getAll() {
  const [rows] = await db.execute('SELECT * FROM produto');
  return rows;
}

// Buscar produto por ID
async function getById(id) {
  const [rows] = await db.execute('SELECT * FROM produto WHERE produto_id = ?', [id]);
  return rows[0];
}

// Criar um novo produto
async function criar(produto) {
  const { nome, descricao, preco, qtd_estoque, categoria_id, imagem_url } = produto;
  const [result] = await db.execute(
    'INSERT INTO produto (nome, descricao, preco, qtd_estoque, categoria_id, imagem_url) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, descricao, preco, qtd_estoque, categoria_id, imagem_url]
  );
  return result.insertId;
}

// Atualizar um produto
async function update(id, produto) {
  const { nome, descricao, preco, qtd_estoque, categoria_id, imagem_url } = produto;
  await db.execute(
    'UPDATE produto SET nome = ?, descricao = ?, preco = ?, qtd_estoque = ?, categoria_id = ?, imagem_url = ? WHERE produto_id = ?',
    [nome, descricao, preco, qtd_estoque, categoria_id, imagem_url, id]
  );
}

// Remover um produto
async function remove(id) {
  await db.execute('DELETE FROM produto WHERE produto_id = ?', [id]);
}

// CORREÇÃO: Altere 'create' para 'criar' para corresponder ao nome da função
module.exports = { getAll, getById, criar, update, remove };