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
// backend/models/produtoModel.js

// ... (outras funções)

exports.criar = async (produto) => {
  const { nome, descricao, preco, qtd_estoque, categoria_id, imagem_url } = produto; // Adicione imagem_url aqui
  const [result] = await db.execute(
    'INSERT INTO produto (nome, descricao, preco, qtd_estoque, categoria_id, imagem_url) VALUES (?, ?, ?, ?, ?, ?)', // Adicione a coluna no INSERT
    [nome, descricao, preco, qtd_estoque, categoria_id, imagem_url] // Adicione a variável na lista
  );
  return result.insertId;
};

// ... (resto do arquivo)

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
