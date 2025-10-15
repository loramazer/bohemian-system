const carrinhoModel = require("../models/carrinhoModel");
const itemModel = require("../models/itemCarrinhoModel");
const db = require('../config/db');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
const preference = new Preference(client);

exports.iniciarCarrinho = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        const usuarioId = req.user.id;
        let carrinho = await carrinhoModel.buscarCarrinhoAtivo(usuarioId);

        if (!carrinho) {
            const novoCarrinhoId = await carrinhoModel.criarCarrinho(usuarioId);
            carrinho = { id_carrinho: novoCarrinhoId, usuario_id: usuarioId, status: "ATIVO" };
        }

        res.json(carrinho);
    } catch (error) {
        console.error("Erro ao iniciar carrinho:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

exports.adicionarItem = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        const { produto_id, quantidade, preco_unitario } = req.body;
        const usuarioId = req.user.id;
        const carrinho = await carrinhoModel.buscarCarrinhoAtivo(usuarioId);

        if (!carrinho) {
            return res.status(404).json({ error: "Carrinho não encontrado para este usuário." });
        }

        await itemModel.adicionarItem(carrinho.id_carrinho, produto_id, quantidade, preco_unitario);
        const itensDoCarrinho = await itemModel.listarItens(carrinho.id_carrinho);

        res.json({ message: "Item adicionado ao carrinho", itens: itensDoCarrinho });
    } catch (error) {
        console.error("Erro ao adicionar item:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

exports.verCarrinho = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        const usuarioId = req.user.id;
        const carrinho = await carrinhoModel.buscarCarrinhoAtivo(usuarioId);

        if (!carrinho) {
            return res.json({ itens: [] });
        }

        const itensDoCarrinho = await itemModel.listarItens(carrinho.id_carrinho);
        res.json({ itens: itensDoCarrinho });
    } catch (error) {
        console.error("Erro ao ver carrinho:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

exports.esvaziarCarrinho = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }
    const usuarioId = req.user.id;
    const carrinho = await carrinhoModel.buscarCarrinhoAtivo(usuarioId);

    if (!carrinho) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }
    
    await itemModel.esvaziar(carrinho.id_carrinho);
    res.json({ message: 'Carrinho esvaziado com sucesso.' });
  } catch (error) {
    console.error("Erro ao esvaziar carrinho:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

exports.criarPreferenciaPagamento = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        const usuarioId = req.user.id;
        const carrinho = await carrinhoModel.buscarCarrinhoAtivo(usuarioId);

        if (!carrinho) {
            return res.status(404).json({ error: "Carrinho não encontrado para este usuário." });
        }

        // CORREÇÃO: Busca os itens diretamente do model
        const itens = await itemModel.listarItens(carrinho.id_carrinho);
        
        if (!itens || itens.length === 0) {
            return res.status(400).json({ error: "O carrinho está vazio." });
        }

        const body = {
            items: itens.map(item => ({
                title: item.nome_produto,
                quantity: item.quantidade,
                unit_price: parseFloat(item.preco_unitario), // Garante que é um número
                currency_id: 'BRL',
            })),
            // CORREÇÃO: URLs de retorno usando uma variável de ambiente para o frontend
            back_urls: {
                success: `${process.env.FRONTEND_URL}/order-confirmed?status=success`, 
                failure: `${process.env.FRONTEND_URL}/order-confirmed?status=failure`,
                pending: `${process.env.FRONTEND_URL}/order-confirmed?status=pending`,
            },
            auto_return: 'approved',
            // Opcional: Notificações para o backend (Webhook)
            // notification_url: `${process.env.BACKEND_URL}/api/pagamento/webhook`,
        };

        const preferenceResult = await preference.create({ body });
        res.json({ id: preferenceResult.id, init_point: preferenceResult.init_point }); // Retorna init_point
    } catch (error) {
        console.error("Erro ao criar preferência de pagamento:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};
