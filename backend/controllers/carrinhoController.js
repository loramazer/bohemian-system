const carrinhoModel = require("../models/carrinhoModel");
const itemModel = require("../models/itemCarrinhoModel");
const db = require('../config/db');

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
    console.error("ERRO DETALHADO: ", err);
    res.status(500).json({ error: "Erro ao iniciar carrinho" });
  }
};


exports.adicionarItem = async (req, res) => {
  try {
    const { produto_id, quantidade, preco_unitario } = req.body;
    const clienteId = req.user.cliente_id;

    const carrinho = await carrinhoModel.buscarCarrinhoAtivo(clienteId);
    if (!carrinho) {
      return res.status(400).json({ error: "Carrinho não iniciado" });
    }

    // Esta linha é a única que deve chamar o banco de dados para adicionar o item.
    await itemModel.adicionarItem(carrinho.carrinho_id, produto_id, quantidade, preco_unitario);

    const itens = await itemModel.listarItens(carrinho.carrinho_id);
    res.json(itens);
  } catch (err) {
    console.error("Erro ao adicionar item:", err);
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
