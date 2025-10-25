const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const adminMiddleware = require('../middlewares/adminMiddleware');

// CRUD de produtos
router.get('/', produtoController.getAll);
router.get('/:id', produtoController.getById);
router.post('/', adminMiddleware, produtoController.upload.single('imagem'), produtoController.create);
router.put('/:id', adminMiddleware, produtoController.update);
router.delete('/:id', adminMiddleware, produtoController.remove);

module.exports = router;