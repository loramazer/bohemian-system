const express = require("express");
const router = express.Router();
const carrinhoController = require("../controllers/carrinhoController");
const authMiddleware = require("../middlewares/authMiddleware"); // garante login

router.post("/carrinho/iniciar", authMiddleware, carrinhoController.iniciarCarrinho);
router.post("/carrinho/adicionar", authMiddleware, carrinhoController.adicionarItem);
router.get("/carrinho", authMiddleware, carrinhoController.verCarrinho);

module.exports = router;
