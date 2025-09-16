const carrinhoModel = require("../models/carrinhoModel");
const itemModel = require("../models/itemCarrinhoModel");
const db = require('../config/db');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
const preference = new Preference(client);

exports.iniciarCarrinho = async (req, res) => {
    try {
        if (!req.user || !req.user.cliente_id) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        const clienteId = req.user.cliente_id;
        let carrinho = await carrinhoModel.buscarCarrinhoAtivo(clienteId);

        if (!carrinho) {
            const novoCarrinhoId = await carrinhoModel.criarCarrinho(clienteId);
            carrinho = { carrinho_id: novoCarrinhoId, cliente_id: clienteId, status: "ATIVO" };
        }

        res.json(carrinho);
    } catch (error) {
        console.error("Erro ao iniciar carrinho:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

exports.adicionarItem = async (req, res) => {
    try {
        if (!req.user || !req.user.cliente_id) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        const { produto_id, quantidade, preco_unitario } = req.body;
        const clienteId = req.user.cliente_id;
        const carrinho = await carrinhoModel.buscarCarrinhoAtivo(clienteId);

        if (!carrinho) {
            return res.status(404).json({ error: "Carrinho não encontrado para este usuário." });
        }

        await itemModel.adicionarItem(carrinho.carrinho_id, produto_id, quantidade, preco_unitario);
        const itensDoCarrinho = await itemModel.listarItens(carrinho.carrinho_id);

        res.json({ message: "Item adicionado ao carrinho", itens: itensDoCarrinho });
    } catch (error) {
        console.error("Erro ao adicionar item:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

exports.verCarrinho = async (req, res) => {
    try {
        if (!req.user || !req.user.cliente_id) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        const clienteId = req.user.cliente_id;
        const carrinho = await carrinhoModel.buscarCarrinhoAtivo(clienteId);

        if (!carrinho) {
            return res.json({ itens: [] });
        }

        const itensDoCarrinho = await itemModel.listarItens(carrinho.carrinho_id);
        res.json({ itens: itensDoCarrinho });
    } catch (error) {
        console.error("Erro ao ver carrinho:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

exports.esvaziarCarrinho = async (req, res) => {
  try {
    if (!req.user || !req.user.cliente_id) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }
    const clienteId = req.user.cliente_id;
    const carrinho = await carrinhoModel.buscarCarrinhoAtivo(clienteId);

    if (!carrinho) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }
    
    await itemModel.esvaziar(carrinho.carrinho_id);
    res.json({ message: 'Carrinho esvaziado com sucesso.' });
  } catch (error) {
    console.error("Erro ao esvaziar carrinho:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

exports.criarPreferenciaPagamento = async (req, res) => {
    try {
        const { itens } = req.body;

        const body = {
            items: itens.map(item => ({
                title: item.nome_produto,
                quantity: item.quantidade,
                unit_price: item.preco_unitario,
                currency_id: 'BRL',
            })),
            back_urls: {
                success: 'http://localhost:3000/pagamento/sucesso', // substitua por sua URL de sucesso
                failure: 'http://localhost:3000/pagamento/falha',   // substitua por sua URL de falha
                pending: 'http://localhost:3000/pagamento/pendente', // substitua por sua URL pendente
            },
            auto_return: 'approved',
        };

        const preferenceResult = await preference.create({ body });
        res.json({ id: preferenceResult.id });
    } catch (error) {
        console.error("Erro ao criar preferência de pagamento:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};