const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', produtoController.getAll);
router.get('/:id', produtoController.getById);

// CRÍTICO: Usa uploadMiddleware (que agora chama multer.array) e espera o campo 'imagens'
router.post('/', adminMiddleware, produtoController.uploadMiddleware, produtoController.create); 

router.put('/:id', adminMiddleware, produtoController.update); // OBS: Requer update na lógica de update do controller para lidar com múltiplos
router.delete('/:id', adminMiddleware, produtoController.remove);

module.exports = router;