const produtoModel = require('../models/produtoModel');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');

// Configurar o Cloudinary com suas credenciais do .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuração do multer para salvar a imagem temporariamente
const upload = multer({ dest: 'uploads/' });

async function create(req, res) {
  try {
    const { nome, preco_venda, descricao, status } = req.body;
    let imagem_url = null;

    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        imagem_url = result.secure_url;
        fs.unlinkSync(req.file.path); // remove arquivo temporário
    }

    const novoProduto = await produtoModel.create({ nome, preco_venda, descricao, status, imagem_url });
    res.status(201).json({ message: 'Produto criado com sucesso', produto: novoProduto });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

async function getAll(req, res) {
  try {
    const produtos = await produtoModel.getAll();
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

async function getById(req, res) {
  try {
    const produto = await produtoModel.getById(req.params.id);
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

async function update(req, res) {
  try {
    const { nome, preco_venda, descricao, status } = req.body;

    // Busca o produto atual
    const produtoAtual = await produtoModel.getById(req.params.id);
    if (!produtoAtual) return res.status(404).json({ message: 'Produto não encontrado' });

    let imagem_url = produtoAtual.imagem_url; // mantém a existente
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        imagem_url = result.secure_url;
        fs.unlinkSync(req.file.path);
    }

    const produtoAtualizado = await produtoModel.update(req.params.id, { nome, preco_venda, descricao, status, imagem_url });
    res.json({ message: 'Produto atualizado com sucesso', produto: produtoAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

async function remove(req, res) {
  try {
    await produtoModel.remove(req.params.id);
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  upload
};
