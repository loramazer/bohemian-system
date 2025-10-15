const produtoModel = require('../models/produtoModel');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ dest: 'uploads/' });

function formatarPreco(preco) {
    if (!preco) return 0;
    const valor = preco.replace(/\s/g, '').replace('R$', '').replace(',', '.');
    return parseFloat(valor);
}

async function create(req, res) {
    try {
        let { nome, preco_venda, descricao, ativo } = req.body;

        preco_venda = formatarPreco(preco_venda);

        let imagem_url = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imagem_url = result.secure_url;
            fs.unlinkSync(req.file.path); // remove arquivo temporário
        }

        const novoProduto = await produtoModel.create({ nome, preco_venda, descricao, ativo, imagem_url });
        res.status(201).json({ message: 'Produto criado com sucesso', produto: novoProduto });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

async function getAll(req, res) {
    try {
        const categoriaNomeCSV = req.query.categoria; 
        const searchTerm = req.query.search;
        const produtos = await produtoModel.getAll(categoriaNomeCSV, searchTerm); 
        
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
        let { nome, preco_venda, descricao, ativo } = req.body;

        // Converte o preço para decimal
        preco_venda = formatarPreco(preco_venda);

        // Busca o produto atual
        const produtoAtual = await produtoModel.getById(req.params.id);
        if (!produtoAtual) return res.status(404).json({ message: 'Produto não encontrado' });

        let imagem_url = produtoAtual.imagem_url; // mantém a existente
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imagem_url = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const produtoAtualizado = await produtoModel.update(req.params.id, { nome, preco_venda, descricao, ativo, imagem_url });
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
