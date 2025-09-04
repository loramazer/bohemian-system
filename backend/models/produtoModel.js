const db = require('../config/db');

// Buscar todos os produtos
async function getAll() {
  const [rows] = await db.execute(`
    SELECT id_produto, nome, preco_venda, descricao, status, imagem_url
    FROM produto
  `);
  return rows;
}

// Buscar produto por ID
async function getById(id) {
  const [rows] = await db.execute('SELECT * FROM produto WHERE id_produto = ?', [id]);
  return rows[0];
}

// Criar produto
async function create({ nome, preco_venda, descricao = null, status = 'ativo', imagem_url = null }) {
  const [result] = await db.execute(
    'INSERT INTO produto (nome, preco_venda, descricao, status, imagem_url) VALUES (?, ?, ?, ?, ?)',
    [nome, preco_venda, descricao, status, imagem_url]
  );
  return { id_produto: result.insertId, nome, preco_venda, descricao, status, imagem_url };
}

// Atualizar produto
async function update(id, { nome, preco_venda, descricao = null, status = 'ativo', imagem_url = null }) {
  await db.execute(
    'UPDATE produto SET nome = ?, preco_venda = ?, descricao = ?, status = ?, imagem_url = ? WHERE id_produto = ?',
    [nome, preco_venda, descricao, status, imagem_url, id]
  );
  return { id_produto: id, nome, preco_venda, descricao, status, imagem_url };
}

// Deletar produto
async function remove(id) {
  await db.execute('DELETE FROM produto WHERE id_produto = ?', [id]);
  return { message: 'Produto removido com sucesso' };
}

module.exports = { getAll, getById, create, update, remove };
