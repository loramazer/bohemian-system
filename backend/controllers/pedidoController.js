// backend/controllers/pedidoController.js
const pedidoModel = require('../models/pedidoModel');

// GET /api/pedidos/meus-pedidos
async function getMeusPedidos(req, res) {
    try {
        // req.user.id é injetado pelo authMiddleware
        const usuarioId = req.user.id; 
        
        if (!usuarioId) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }

        const pedidos = await pedidoModel.findByUsuarioId(usuarioId);
        
        res.status(200).json(pedidos);

    } catch (error) {
        console.error('Erro no controller ao buscar "Meus Pedidos":', error);
        res.status(500).json({ message: 'Erro interno ao buscar pedidos.' });
    }
}

module.exports = { getMeusPedidos };