const pedidoModel = require('../models/pedidoModel');

async function getMeusPedidos(req, res) {
    try {
        const usuarioId = req.user.id; 
        console.log("DEBUG: Rota /meus-pedidos chamada.");
    console.log("DEBUG: Objeto req.user:", req.user.id);
        
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