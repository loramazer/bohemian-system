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

// --- INÍCIO DA CORREÇÃO ---
// Importe 'multer' e 'path' e defina o 'storage' AQUI
const multer = require('multer');
const path = require('path');

// (Esta é a configuração de armazenamento que estava no seu server.js)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Garante que o caminho 'uploads/' exista na raiz do backend
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Gera um nome de arquivo único
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });
// --- FIM DA CORREÇÃO ---



// Rota POST (Criar)
router.post(
    '/', 
    adminMiddleware, 
    // Agora 'upload' está definido neste arquivo
    upload.array('imagens', 5), 
    produtoController.create
);

// Rota PUT (Atualizar)
router.put(
    '/:id', 
    adminMiddleware, 
    // E 'upload' também funciona aqui
    upload.array('imagens', 5), 
    produtoController.update 
);

router.delete('/:id', adminMiddleware, produtoController.remove);

module.exports = router;