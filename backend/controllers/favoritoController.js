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
    }
};

// POST /api/favoritos
exports.addFavorito = async (req, res) => {
    try {
        const id_usuario = req.user.id;
        const { id_produto } = req.body;
        
        await favoritoModel.add(id_usuario, id_produto);
        // Retorna a nova lista de favoritos
        const favoritos = await favoritoModel.findByUserId(id_usuario);
        res.status(201).json(favoritos);
    } catch (error) {
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