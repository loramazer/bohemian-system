// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Agora, usamos authController.registrar, que é a função correta
router.post('/registrar', authController.registrar);

// E authController.login para a rota de login
router.post('/login', authController.login);

module.exports = router;
