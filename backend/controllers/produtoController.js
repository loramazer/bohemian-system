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

async function processarImagens(files) {
    const urls = [];
    if (files && files.length > 0) {
        for (const file of files) {
            // Se for um arquivo temporário do multer, sobe para o Cloudinary
            if (file.path) {
                const result = await cloudinary.uploader.upload(file.path);
                urls.push(result.secure_url);
                fs.unlinkSync(file.path); // remove arquivo temporário
            } else if (typeof file === 'string') {
                // Caso seja uma URL existente que está sendo mantida na atualização
                urls.push(file);
            }
        }
    }
    // Retorna a lista de URLs como uma string JSON
    return JSON.stringify(urls);
}

async function create(req, res) {
    try {
        let { nome, preco_venda, descricao, ativo, categoria } = req.body; // <-- OBTÉM a categoria

        preco_venda = formatarPreco(preco_venda);

        const imagem_url_json = await processarImagens(req.files);
        // O campo 'imagem_url' agora contém a string JSON de todas as URLs.
        let imagem_url = imagem_url_json;

        const novoProduto = await produtoModel.create({ nome, preco_venda, descricao, ativo, imagem_url });
        
        if (categoria) {
            await produtoModel.addCategoryToProduct(novoProduto.id_produto, categoria); 
        }

        res.status(201).json({ message: 'Produto criado com sucesso', produto: novoProduto });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

async function getAll(req, res) {
    try {
        // Extrair todos os parâmetros da query que o frontend envia
        const {
            categories, // Vem como '1,2,3'
            search,
            sort,
            maxPrice,
            page,
            limit
        } = req.query;

        // Passar os parâmetros para o model
        // O model fará a lógica de paginação e filtragem
        const result = await produtoModel.getAll({
            categories, // O model vai tratar a string '1,2,3'
            search,
            sort,
            maxPrice: maxPrice ? parseFloat(maxPrice) : null,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 9 // Padrão de 9 itens
        });
        
        // O model agora retorna um objeto { products, totalPages, ... }
        res.json(result); 

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
    getAll, // Esta é a função que atualizamos
    getById,
    update,
    remove,
    uploadMiddleware: upload.array('imagens', 4)
};