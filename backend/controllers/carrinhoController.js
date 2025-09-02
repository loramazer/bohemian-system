const carrinhoModel = require("../models/carrinhoModel");
const itemModel = require("../models/itemCarrinhoModel");
const db = require('../config/db');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
const preference = new Preference(client);

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

exports.criarPreferenciaPagamento = async (req, res) => {
  try {
    const clienteId = req.user.cliente_id;
    const carrinho = await carrinhoModel.buscarCarrinhoAtivo(clienteId);
    if (!carrinho) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    const itensDoCarrinho = await itemModel.listarItens(carrinho.carrinho_id);
    if (itensDoCarrinho.length === 0) {
      return res.status(400).json({ error: 'Seu carrinho está vazio' });
    }

    // Mapeia os itens do seu carrinho para o formato que o Mercado Pago espera
    const itemsParaMP = itensDoCarrinho.map(item => ({
      id: item.produto_id,
      title: item.nome_produto || 'Produto', // Garanta que você tem o nome do produto
      quantity: item.quantidade,
      currency_id: 'BRL',
      unit_price: parseFloat(item.preco_unitario)
    }));

    const body = {
      items: itemsParaMP,
      back_urls: {
        success: "http://localhost:5173/order-confirmed", // URL para onde o usuário volta em caso de sucesso
        failure: "http://localhost:5173/cart",          // URL de falha
        pending: "http://localhost:5173/cart"           // URL de pendência
      },
      auto_return: "approved",
    };

    const result = await preference.create({ body });

    // Envia o link de checkout de volta para o frontend
    res.json({ id: result.id, init_point: result.init_point });

  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    res.status(500).json({ error: 'Falha ao iniciar pagamento' });
  }
};
