// backend/routes/favoritoRoutes.js
const express = require('express');
const router = express.Router();
const favoritoController = require('../controllers/favoritoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas de favoritos são protegidas
router.use(authMiddleware);

router.get('/', favoritoController.getFavoritos);
router.post('/', favoritoController.addFavorito);
router.delete('/:produtoId', favoritoController.removeFavorito);

module.exports = router;