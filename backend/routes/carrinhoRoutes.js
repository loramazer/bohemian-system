const express = require("express");
const router = express.Router();
const {
  iniciarCarrinho,
  adicionarItem,
  verCarrinho,
  criarPreferenciaPagamento,
  esvaziarCarrinho
} = require("../controllers/carrinhoController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rotas protegidas por autenticação
router.post("/iniciar", authMiddleware, iniciarCarrinho);
router.post("/adicionar", authMiddleware, adicionarItem);
router.get("/", authMiddleware, verCarrinho);
router.delete("/", authMiddleware, esvaziarCarrinho);
router.post("/pagamento/criar-preferencia", authMiddleware, criarPreferenciaPagamento);

module.exports = router;