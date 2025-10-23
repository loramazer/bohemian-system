const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, enderecoController.listarEnderecos);
router.post('/', authMiddleware, enderecoController.adicionarEndereco);

module.exports = router;