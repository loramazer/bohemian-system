const db = require('../config/db');


async function getAll() {
  const [rows] = await db.execute('SELECT * FROM categoria');
  return rows;
}

async function getById(id) {
  const [rows] = await db.execute('SELECT * FROM categoria WHERE id_categoria = ?', [id]);
  return rows[0];
}

async function create(nome, descricao = null) {
  const [result] = await db.execute(
    'INSERT INTO categoria (nome, descricao) VALUES (?, ?)',
    [nome, descricao]
  );
  return { id_categoria: result.insertId, nome, descricao };
}


async function update(id, nome, descricao = null) {
  await db.execute(
    'UPDATE categoria SET nome = ?, descricao = ? WHERE id_categoria = ?',
    [nome, descricao, id]
  );
  return { id_categoria: id, nome, descricao };
}


async function remove(id) {
  await db.execute('DELETE FROM categoria WHERE id_categoria = ?', [id]);
  return { message: 'Categoria removida com sucesso' };
}

module.exports = { getAll, getById, create, update, remove };
