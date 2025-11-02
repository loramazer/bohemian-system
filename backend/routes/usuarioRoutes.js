// backend/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protege todas as rotas deste arquivo
router.use(authMiddleware);

// Rota para buscar o perfil do usuário logado
router.get('/me', usuarioController.getMeuPerfil);

// Rota para atualizar o perfil do usuário logado
router.put('/me', usuarioController.updateMeuPerfil);

module.exports = router;