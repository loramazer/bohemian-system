const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const authMiddleware = require('../middlewares/authMiddleware'); 

router.post(
    '/criar-preferencia', 
    authMiddleware, 
    pagamentoController.criarPreferencia
);

router.post('/webhook', pagamentoController.receberWebhook);

router.post('/confirmar-pedido', pagamentoController.confirmarPedido);

module.exports = router;