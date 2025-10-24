const Categoria = require('../models/categoriaModel');

async function getAll(req, res) {
  try {
    // A função getAll é a que o frontend está buscando via GET /api/categorias
    const categorias = await Categoria.getAll();
    
    // Esta linha finaliza a requisição com sucesso (200 OK) e envia os dados.
    res.json(categorias); 
  } catch (error) {
    // Se o banco de dados falhar ou houver outro erro, ele envia 500.
    res.status(500).json({ message: error.message });
  }
}

async function getById(req, res) {
  try {
    const categoria = await Categoria.getById(req.params.id);
    if (!categoria) return res.status(404).json({ message: 'Categoria não encontrada' });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req, res) {
  try {
    const novaCategoria = await Categoria.create(req.body.nome);
    res.status(201).json(novaCategoria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const categoriaAtualizada = await Categoria.update(req.params.id, req.body.nome);
    res.json(categoriaAtualizada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const resultado = await Categoria.remove(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getAll, getById, create, update, remove };