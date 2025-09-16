// loramazer/bohemian-system/bohemian-system-front-back-carrinhos/backend/routes/carrinhoRoutes.js

const express = require("express");
const router = express.Router();
const {
  iniciarCarrinho,
  adicionarItem,
  verCarrinho,
  criarPreferenciaPagamento,
  esvaziarCarrinho // Adicione a nova função aqui
} = require("../controllers/carrinhoController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/iniciar", authMiddleware, iniciarCarrinho);
router.post("/adicionar", authMiddleware, adicionarItem);
router.get("/", authMiddleware, verCarrinho);
router.post("/pagamento/criar-preferencia", authMiddleware, criarPreferenciaPagamento);

// NOVA ROTA para esvaziar o carrinho
router.delete("/", authMiddleware, esvaziarCarrinho);

module.exports = router;