// backend/routes/pedidoRoutes.js
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protege a rota: apenas usuários logados (comuns ou admin) podem acessar
router.get(
    '/meus-pedidos', 
    authMiddleware, 
    pedidoController.getMeusPedidos
);

module.exports = router;