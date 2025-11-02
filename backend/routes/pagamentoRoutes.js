const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const authMiddleware = require('../middlewares/authMiddleware'); // (Use o seu middleware)

// Rota para criar a preferência de pagamento
router.post(
    '/criar-preferencia', 
    authMiddleware, 
    pagamentoController.criarPreferencia
);

router.post('/webhook', pagamentoController.receberWebhook);

// Rotas
router.post('/confirmar-pedido', pagamentoController.confirmarPedido);

module.exports = router;