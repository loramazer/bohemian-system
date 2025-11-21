const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const adminMiddleware = require('../middlewares/adminMiddleware');
const multer = require('multer');
const path = require('path');

// Configuração do Multer (Upload de imagens)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

// --- ROTAS PÚBLICAS ---
router.get('/', produtoController.getAll);
router.get('/:id', produtoController.getById);

// --- ROTAS ADMINISTRATIVAS (Protegidas) ---

// 1. Criar Produto (com upload)
router.post(
    '/', 
    adminMiddleware, 
    upload.array('imagens', 5), 
    produtoController.create
);

// 2. Atualizar Produto (com upload)
router.put(
    '/:id', 
    adminMiddleware, 
    upload.array('imagens', 5), 
    produtoController.update 
);

// 3. Remover Produto
router.delete('/:id', adminMiddleware, produtoController.remove);

// 4. Alternar Status (Ativar/Desativar) - A ROTA QUE FALTAVA
router.patch('/:id/status', adminMiddleware, produtoController.toggleStatus);

module.exports = router;