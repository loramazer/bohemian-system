const express = require("express");
const router = express.Router();
const carrinhoController = require("../controllers/carrinhoController");
const authMiddleware = require("../middlewares/authMiddleware"); // garante login

// REMOVA o prefixo "/carrinho" daqui
router.post("/iniciar", authMiddleware, carrinhoController.iniciarCarrinho);
router.post("/adicionar", authMiddleware, carrinhoController.adicionarItem);
router.get("/", authMiddleware, carrinhoController.verCarrinho); // A rota principal agora é só "/"

module.exports = router;