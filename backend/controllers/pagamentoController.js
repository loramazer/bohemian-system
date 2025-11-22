const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const pool = require('../config/db.js');
const carrinhoModel = require('../models/carrinhoModel');
const itemCarrinhoModel = require('../models/itemCarrinhoModel');
const pedidoModel = require('../models/pedidoModel'); 
const usuarioModel = require('../models/usuarioModel');


const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });


exports.criarPreferencia = async (req, res) => {
    try {
        const { cartItems, shippingCost, deliveryOption, selectedAddressId, clienteId } = req.body;
        
        if (!clienteId) return res.status(400).json({ message: "O clienteId é obrigatório." });

        const usuario = await usuarioModel.findById(clienteId);
        if (!usuario) return res.status(404).json({ message: "Usuário não encontrado." });

        const carrinho = await carrinhoModel.buscarCarrinhoAtivo(clienteId);
        if (!carrinho) return res.status(404).json({ message: "Carrinho não encontrado." });
        const id_carrinho = carrinho.id_carrinho;

        const itensValidos = cartItems.filter(item => item.quantidade > 0);
        if (itensValidos.length === 0) return res.status(400).json({ message: "Carrinho vazio." });

        const items = itensValidos.map(item => ({
            id: item.id_item_carrinho.toString(),
            title: item.nome_produto,
            quantity: parseInt(item.quantidade, 10), 
            currency_id: 'BRL',
            unit_price: parseFloat(item.preco_unitario)
        }));

        const enderecoParaSalvar = deliveryOption === 'retirada' ? null : selectedAddressId;
        const novoIdPedido = Date.now().toString(); 

        const [novaFormaPagamentoResult] = await pool.query(
            `INSERT INTO forma_pagamento (status_transacao, descricao) VALUES (?, ?)`,
            ['pending', 'Aguardando Pagamento no MP']
        );
        const novoFormaPagamentoId = novaFormaPagamentoResult.insertId;

        await pool.query(
            `INSERT INTO pedido (id_pedido, fk_id_usuario, fk_forma_pagamento_id_forma_pagamento, fk_endereco_id_endereco, dataPedido, status_pedido) VALUES (?, ?, ?, ?, ?, ?)`,
            [novoIdPedido, clienteId, novoFormaPagamentoId, enderecoParaSalvar, new Date(), 'Pendente']
        );

        const insertPromises = itensValidos.map(item => {
            return pool.query(
                `INSERT INTO itempedido (fk_pedido_id_pedido, fk_produto_id_produto, quantidade, precoUnitario) VALUES (?, ?, ?, ?)`,
                [novoIdPedido, item.id_produto, item.quantidade, item.preco_unitario]
            );
        });
        await Promise.all(insertPromises);

        const externalReferenceObj = {
            id_pedido_banco: novoIdPedido, 
            id_carrinho: id_carrinho
        };

        const preferenceBody = {
            items: items, 
            payer: { name: usuario.nome },
            shipments: {
                cost: parseFloat(shippingCost) || 0,
                mode: 'not_specified',
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL}/pedido/sucesso`,
                failure: `${process.env.FRONTEND_URL}/meus-pedidos`,
                pending: `${process.env.FRONTEND_URL}/meus-pedidos`,
            },
            auto_return: 'approved',
            external_reference: JSON.stringify(externalReferenceObj),
            notification_url: `${process.env.BACKEND_URL}/api/pagamentos/webhook`,
        };
      
        const preference = new Preference(client);
        const response = await preference.create({ body: preferenceBody });
        
        res.json({ id: response.id, init_point: response.init_point });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar preferência." });
    }
};

const processarNovoPedido = async (paymentId) => {
    try {
        const payment = new Payment(client);
        const pagamentoInfo = await payment.get({ id: paymentId });
        const statusPagamento = pagamentoInfo.status; 

        if (!pagamentoInfo.external_reference) return;

        const { id_pedido_banco, id_carrinho } = JSON.parse(pagamentoInfo.external_reference);
        
        if (!id_pedido_banco) return;

        let novoStatusPedido = 'Pendente';
        if (statusPagamento === 'approved') novoStatusPedido = 'Em Preparação';
        if (statusPagamento === 'cancelled' || statusPagamento === 'rejected') novoStatusPedido = 'Cancelado';

        await pool.query(
            `UPDATE forma_pagamento fp 
             JOIN pedido p ON fp.id_forma_pagamento = p.fk_forma_pagamento_id_forma_pagamento
             SET fp.status_transacao = ?, fp.data_pagamento = ?, fp.id_transacao_mp = ?
             WHERE p.id_pedido = ?`,
            [statusPagamento, pagamentoInfo.date_approved, paymentId.toString(), id_pedido_banco]
        );

        await pool.query(
            `UPDATE pedido SET status_pedido = ? WHERE id_pedido = ?`,
            [novoStatusPedido, id_pedido_banco]
        );

        if (statusPagamento === 'approved' && id_carrinho) {
            await itemCarrinhoModel.esvaziar(id_carrinho);
        }

        return { id_pedido: id_pedido_banco, status: statusPagamento };

    } catch (error) {
        console.error(`ERRO webhook:`, error);
        throw error; 
    }
};


exports.confirmarPedido = async (req, res) => {
    try {
        const { paymentId } = req.body;
        console.log(`[confirmarPedido] Recebido do frontend: ${paymentId}`);

        if (!paymentId) {
            return res.status(400).send('paymentId é obrigatório.');
        }

        const pedidoSalvo = await processarNovoPedido(paymentId); 

        if (pedidoSalvo) {
            return res.status(201).json(pedidoSalvo);
        } else {
            return res.status(400).send("Pagamento não foi aprovado ou já processado.");
        }

    } catch (error){
        console.error('Erro em [confirmarPedido]:', error.message);
        return res.status(500).send('Erro interno do servidor.');
    }
};


exports.receberWebhook = async (req, res) => {
    console.log("--- WEBHOOK RECEBIDO ---");
    
    try {
        const paymentId = req.body.data?.id;
        const type = req.body.type;

        if (type === 'payment' && paymentId) {
            console.log(`[receberWebhook] Processando PaymentID: ${paymentId}`);
            
            
            await processarNovoPedido(paymentId);

        } else {
            console.log("[receberWebhook] Notificação não é do tipo 'payment', ignorando.");
        }
        
        res.status(200).send("Webhook recebido.");

    } catch (error) {
        console.error("Erro ao processar webhook:", error.message);
        res.status(200).send("Erro interno registrado, webhook descartado.");
    }
};