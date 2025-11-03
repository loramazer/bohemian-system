const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get(
    '/meus-pedidos', 
    authMiddleware, 
    pedidoController.getMeusPedidos
);

module.exports = router;