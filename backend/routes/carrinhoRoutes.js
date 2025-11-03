const express = require("express");
const router = express.Router();
const {
  iniciarCarrinho,
  adicionarItem,
  verCarrinho,
  criarPreferenciaPagamento,
  esvaziarCarrinho,
  atualizarItem,
  removerItem
} = require("../controllers/carrinhoController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/iniciar", authMiddleware, iniciarCarrinho);
router.post("/adicionar", authMiddleware, adicionarItem);
router.get("/", authMiddleware, verCarrinho);
router.delete("/", authMiddleware, esvaziarCarrinho);
router.post("/pagamento/criar-preferencia", authMiddleware, criarPreferenciaPagamento);
router.put('/item/:itemId', authMiddleware, atualizarItem);
router.delete('/item/:itemId', authMiddleware, removerItem);

module.exports = router;