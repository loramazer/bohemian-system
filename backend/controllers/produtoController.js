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
        const {
            categories,
            search,
            sort,
            maxPrice,
            page,
            limit,
            ativo // <--- NOVO: Recebe o parâmetro ativo
        } = req.query;

        // Passa o parâmetro 'ativo' para o model
        const result = await produtoModel.getAll({
            categories,
            search,
            sort,
            maxPrice: maxPrice ? parseFloat(maxPrice) : null,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 9,
            ativo // <--- NOVO
        });
        
        res.json(result); 

    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

// --- NOVA FUNÇÃO: Adicione esta função ---
async function toggleStatus(req, res) {
    try {
        const { id } = req.params;
        // Chama o método no model para inverter o status (crie esse método no model se não existir)
        // Se seu model não tiver 'toggleStatus', você pode usar uma query direta aqui ou no model.
        // Exemplo genérico chamando o model:
        await produtoModel.toggleStatus(id); 
        
        res.status(200).json({ message: 'Status do produto alterado com sucesso' });
    } catch (error) {
        console.error('Erro ao alterar status:', error);
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
    const { id } = req.params;
    // Agora o req.body funcionará:
    let { nome, preco_venda, descricao, ativo, categoria, imagens } = req.body;

    try {
        preco_venda = formatarPreco(preco_venda);

        let existingImageUrls = [];
        
        // 1. Coleta imagens existentes (que vêm como strings de URL)
        if (imagens) {
            const imagesArray = Array.isArray(imagens) ? imagens : [imagens];
            existingImageUrls = imagesArray.filter(img => typeof img === 'string');
        }

        // 2. Coleta imagens novas (que vêm via req.files)
        let newImageUrls = [];
        if (req.files && req.files.length > 0) {
            // Reutiliza a lógica de processamento de imagens do Cloudinary
            // (Assumindo que sua função processarImagens lida com 'req.files')
            const newUrlsJson = await processarImagens(req.files);
            newImageUrls = JSON.parse(newUrlsJson);
        }

        // 3. Combina as listas e salva no formato JSON
        const allImageUrls = [...existingImageUrls, ...newImageUrls];
        const imagem_url_json = JSON.stringify(allImageUrls);

        // 4. Atualiza os dados principais do produto (usando 'ativo = 1' como no seu model)
        const produtoAtualizado = await produtoModel.update(id, {
            nome,
            preco_venda,
            descricao,
            ativo: ativo || 1,
            imagem_url: imagem_url_json
        });

        // 5. Atualiza a categoria
        if (categoria) {
            // Esta função (que vamos criar na Etapa 3) limpa as categorias antigas
            // e adiciona a nova, evitando duplicatas.
            await produtoModel.updateProductCategory(id, categoria);
        }
        
        res.status(200).json({ message: 'Produto atualizado com sucesso', produto: produtoAtualizado });

    } catch (error) {
        console.error('Erro ao atualizar produto:', error); 
        res.status(500).json({ message: 'Erro interno no servidor' });
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
    toggleStatus, // <--- NOVO: Não esqueça de exportar!
    uploadMiddleware: upload.array('imagens', 4)
};