const db = require('../config/db');

// Buscar todos os produtos
async function getAll() {
  const [rows] = await db.execute(`
    SELECT id_produto, nome, preco_venda, descricao, status
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
async function create({ nome, preco_venda, descricao = null, status = 'ativo' }) {
  const [result] = await db.execute(
    'INSERT INTO produto (nome, preco_venda, descricao, status) VALUES (?, ?, ?, ?)',
    [nome, preco_venda, descricao, status]
  );
  return { id_produto: result.insertId, nome, preco_venda, descricao, status };
}

// Atualizar produto
async function update(id, { nome, preco_venda, descricao = null, status = 'ativo' }) {
  await db.execute(
    'UPDATE produto SET nome = ?, preco_venda = ?, descricao = ?, status = ? WHERE id_produto = ?',
    [nome, preco_venda, descricao, status, id]
  );
  return { id_produto: id, nome, preco_venda, descricao, status };
}

// Deletar produto
async function remove(id) {
  await db.execute('DELETE FROM produto WHERE id_produto = ?', [id]);
  return { message: 'Produto removido com sucesso' };
}

module.exports = { getAll, getById, create, update, remove };
