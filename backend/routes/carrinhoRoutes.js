// loramazer/bohemian-system/bohemian-system-front-back-carrinhos/backend/routes/carrinhoRoutes.js

const express = require("express");
const router = express.Router();
// 1. Importe a nova função junto com as outras
const { 
    iniciarCarrinho, 
    adicionarItem, 
    verCarrinho, 
    criarPreferenciaPagamento // <-- Adicione a função aqui
} = require("../controllers/carrinhoController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/iniciar", authMiddleware, iniciarCarrinho);
router.post("/adicionar", authMiddleware, adicionarItem);
router.get("/", authMiddleware, verCarrinho);

// 2. Agora esta rota funcionará, pois a função foi importada
router.post("/pagamento/criar-preferencia", authMiddleware, criarPreferenciaPagamento);

module.exports = router;