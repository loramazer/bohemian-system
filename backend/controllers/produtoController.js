const Produto = require('../models/produtoModel');

async function getAll(req, res) {
  try {
    const produtos = await Produto.getAll();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getById(req, res) {
  try {
    const produto = await Produto.getById(req.params.id);
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(produto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function create(req, res) {
  try {
    const novoProduto = await Produto.create(req.body);
    res.status(201).json(novoProduto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const produtoAtualizado = await Produto.update(req.params.id, req.body);
    res.json(produtoAtualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const resultado = await Produto.remove(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getAll, getById, create, update, remove };
