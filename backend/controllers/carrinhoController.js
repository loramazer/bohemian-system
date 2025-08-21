const carrinhoModel = require("../models/carrinhoModel");
const itemModel = require("../models/itemCarrinhoModel");

exports.iniciarCarrinho = async (req, res) => {
  try {
    const clienteId = req.user.cliente_id;
    let carrinho = await carrinhoModel.buscarCarrinhoAtivo(clienteId);

    if (!carrinho) {
      const novoCarrinhoId = await carrinhoModel.criarCarrinho(clienteId);
      carrinho = { carrinho_id: novoCarrinhoId, cliente_id: clienteId, status: "ATIVO" };
    }

    res.json(carrinho);
  } catch (err) {
    res.status(500).json({ error: "Erro ao iniciar carrinho" });
  }
};


exports.adicionarItem = async (req, res) => {
  try {
    const { produtoId, quantidade, preco } = req.body;
    const clienteId = req.user.cliente_id;

    const carrinho = await carrinhoModel.buscarCarrinhoAtivo(clienteId);
    if (!carrinho) return res.status(400).json({ error: "Carrinho não iniciado" });

    await itemModel.adicionarItem(carrinho.carrinho_id, produtoId, quantidade, preco);

    const itens = await itemModel.listarItens(carrinho.carrinho_id);
    res.json(itens);
  } catch (err) {
    res.status(500).json({ error: "Erro ao adicionar item" });
  }
};


exports.verCarrinho = async (req, res) => {
  try {
    const clienteId = req.user.cliente_id;
    const carrinho = await carrinhoModel.buscarCarrinhoAtivo(clienteId);
    if (!carrinho) return res.json({ itens: [] });

    const itens = await itemModel.listarItens(carrinho.carrinho_id);
    res.json({ carrinho, itens });
  } catch (err) {
    res.status(500).json({ error: "Erro ao carregar carrinho" });
  }
};
