const db = require('../config/db');

// Manteremos as suas funções com os nomes originais em português

// Buscar todos os produtos
async function getAll() {
  const [rows] = await db.execute(`
    SELECT 
      id_produto, 
      nome, 
      preco_venda, 
      descricao, 
      ativo, 
      imagem_url 
    FROM produto
  `);
  return rows;
}
// Buscar produto por ID
async function getById(id) {
  // CORRIGIDO: A coluna `produto_id` foi alterada para `id_produto`
  const [rows] = await db.execute('SELECT * FROM produto WHERE id_produto = ?', [id]);
  return rows[0];
}

// Criar produto
async function create({ nome, preco_venda, descricao = null, ativo = 1, imagem_url = null }) {
  const [result] = await db.execute(
    'INSERT INTO produto (nome, preco_venda, descricao, ativo, imagem_url) VALUES (?, ?, ?, ?, ?)',
    [nome, preco_venda, descricao, ativo, imagem_url]
  );
  return { id_produto: result.insertId, nome, preco_venda, descricao, ativo, imagem_url };
}

// Atualizar produto
async function update(id, { nome, preco_venda, descricao = null, ativo = 1, imagem_url = null }) {
  await db.execute(
    'UPDATE produto SET nome = ?, preco_venda = ?, descricao = ?, ativo = ?, imagem_url = ? WHERE id_produto = ?',
    [nome, preco_venda, descricao, ativo, imagem_url, id]
  );
  return { id_produto: id, nome, preco_venda, descricao, ativo, imagem_url };
}

// Remover um produto
async function remove(id) {
  // CORRIGIDO: A coluna `produto_id` foi alterada para `id_produto`
  await db.execute('DELETE FROM produto WHERE id_produto = ?', [id]);
}

module.exports = { getAll, getById, create, update, remove };