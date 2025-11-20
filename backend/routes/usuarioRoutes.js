const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');


router.use(authMiddleware);


router.get('/me', usuarioController.getMeuPerfil);


router.put('/me', usuarioController.updateMeuPerfil);

module.exports = router;