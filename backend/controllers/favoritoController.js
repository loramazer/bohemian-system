// backend/controllers/favoritoController.js
const favoritoModel = require('../models/favoritoModel');

// GET /api/favoritos
exports.getFavoritos = async (req, res) => {
    try {
        const id_usuario = req.user.id;
        const favoritos = await favoritoModel.findByUserId(id_usuario);
        res.status(200).json(favoritos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar favoritos." });
        console.error("Erro ao buscar favoritos:", error);
    }
};

// POST /api/favoritos
exports.addFavorito = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            console.error("Erro ao adicionar favorito: Usuário não autenticado (req.user.id está nulo).");
            return res.status(401).json({ message: "Usuário não autenticado." });
        }
        const id_usuario = req.user.id;
        const { id_produto } = req.body;
        if (!id_produto) {
            console.error("Erro ao adicionar favorito: produto_id não foi enviado no req.body.");
            return res.status(400).json({ message: "ID do produto é obrigatório." });
        }
        console.log(`[Favoritos POST] Usuário ${id_usuario} adicionando produto ${id_produto}`);
        await favoritoModel.add(id_usuario, id_produto);
        // Retorna a nova lista de favoritos
        const favoritos = await favoritoModel.findByUserId(id_usuario);
        res.status(201).json(favoritos);
    } catch (error) {
        console.error("Erro GERAL ao adicionar favorito:", error);
        res.status(500).json({ message: "Erro ao adicionar favorito." });
    }
};

// DELETE /api/favoritos/:produtoId
exports.removeFavorito = async (req, res) => {
    try {
        const id_usuario = req.user.id;
        const { produtoId } = req.params;

        await favoritoModel.remove(id_usuario, produtoId);
        // Retorna a nova lista de favoritos
        const favoritos = await favoritoModel.findByUserId(id_usuario);
        res.status(200).json(favoritos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao remover favorito." });
    }
};