const db = require('../config/db');

// Buscar todas as categorias
async function getAll() {
  const [rows] = await db.execute('SELECT * FROM categoria');
  return rows;
}

// Buscar categoria por ID
async function getById(id) {
  const [rows] = await db.execute('SELECT * FROM categoria WHERE id = ?', [id]);
  return rows[0];
}

// Criar nova categoria
async function create(nome) {
  const [result] = await db.execute(
    'INSERT INTO categoria (nome) VALUES (?)',
    [nome]
  );
  return { id: result.insertId, nome };
}

// Atualizar categoria
async function update(id, nome) {
  await db.execute('UPDATE categoria SET nome = ? WHERE id = ?', [nome, id]);
  return { id, nome };
}

// Deletar categoria
async function remove(id) {
  await db.execute('DELETE FROM categoria WHERE id = ?', [id]);
  return { message: 'Categoria removida com sucesso' };
}

module.exports = { getAll, getById, create, update, remove };
