const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// CRUD de produtos
router.get('/', produtoController.getAll);
router.get('/:id', produtoController.getById);
router.post('/', produtoController.upload.single('imagem'), produtoController.create);
router.put('/:id', produtoController.update);
router.delete('/:id', produtoController.remove);

module.exports = router;