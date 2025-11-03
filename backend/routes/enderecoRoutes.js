const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, enderecoController.getEnderecosUsuario);
router.post('/', authMiddleware, enderecoController.createEndereco);
router.delete('/:id', authMiddleware, enderecoController.deleteEndereco);

module.exports = router;