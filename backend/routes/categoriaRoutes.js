const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// CRUD de categorias
router.get('/', categoriaController.getAll);
router.get('/:id', categoriaController.getById);
router.post('/', categoriaController.create);
router.put('/:id', categoriaController.update);
router.delete('/:id', categoriaController.remove);

module.exports = router;
