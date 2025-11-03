const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const pool = require('../config/db.js');
const carrinhoModel = require('../models/carrinhoModel');
const itemCarrinhoModel = require('../models/itemCarrinhoModel');O
const pedidoModel = require('../models/pedidoModel'); 
const usuarioModel = require('../models/usuarioModel');


const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });


const processarNovoPedido = async (paymentId) => {
    try {
        console.log(`[processarNovoPedido] Iniciando processo para PaymentID: ${paymentId}`);

        const payment = new Payment(client);
        console.log(`[processarNovoPedido] Verificando ${paymentId} no Mercado Pago...`);
        const pagamentoInfo = await payment.get({ id: paymentId });
        
        const statusPagamento = pagamentoInfo.status; 

        const [pedidoExistenteRows] = await pool.query(
            `SELECT * FROM pedido WHERE id_pedido = ?`,
            [paymentId.toString()]
        );
        const pedidoExistente = pedidoExistenteRows[0];


        if (!pedidoExistente) {

            console.log(`[processarNovoPedido] Pedido ${paymentId} NÃO existe. Criando novo pedido...`);

            if (!pagamentoInfo.external_reference) { /* ... */ }
            const { clienteId, enderecoId, id_carrinho } = JSON.parse(pagamentoInfo.external_reference);
            if (clienteId == null || id_carrinho == null) { /* ... */ }

            const statusPedido = (statusPagamento === 'approved') ? 'Em Preparação' : 'Pendente';


            const [novaFormaPagamentoResult] = await pool.query(
                `INSERT INTO forma_pagamento (id_transacao_mp, status_transacao, data_pagamento, descricao, qr_code_url) VALUES (?, ?, ?, ?, ?)`,
                [
                    pagamentoInfo.id.toString(),
                    statusPagamento,
                    pagamentoInfo.date_approved,
                    pagamentoInfo.payment_method_id,
                    pagamentoInfo.point_of_interaction?.transaction_data?.qr_code_url
                ]
            );
            const novoFormaPagamentoId = novaFormaPagamentoResult.insertId;

            const [novoPedidoResult] = await pool.query(
               `INSERT INTO pedido (id_pedido, fk_id_usuario, fk_forma_pagamento_id_forma_pagamento, fk_endereco_id_endereco, dataPedido, status_pedido) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    pagamentoInfo.id.toString(), clienteId, novoFormaPagamentoId, enderecoId, new Date(), statusPedido
                ]
            );
            const idPedidoCriado = pagamentoInfo.id.toString();


            return { id_pedido: idPedidoCriado };

        } else {
            console.log(`[PNP] Pedido ${paymentId} JÁ EXISTE.`);

            if (statusPagamento === 'approved' && pedidoExistente.status_pedido === 'Pendente') {
                
                console.log(`[PNP] ATUALIZANDO pedido de 'Pendente' para 'Aprovado'.`);

                await pedidoModel.atualizarStatusPagamento(
                    paymentId.toString(),
                    'approved',
                    'Em Preparação',
                    pagamentoInfo.date_approved
                );

                if (!pagamentoInfo.external_reference) { /* ... */ }
                const { id_carrinho } = JSON.parse(pagamentoInfo.external_reference);
                await itemCarrinhoModel.esvaziar(id_carrinho);
                console.log(`[PNP] Carrinho ${id_carrinho} esvaziado (via webhook).`);
                return pedidoExistente;
            
            } else if (statusPagamento === 'cancelled' || statusPagamento === 'rejected') {
                console.log(`[PNP] ATUALIZANDO pedido para '${statusPagamento}'.`);
                
                await pedidoModel.atualizarStatusPagamento(
                    paymentId.toString(),
                    statusPagamento,
                    'Cancelado'
                );
                return pedidoExistente;

            } else {
                console.log(`[PNP] Webhook ignorado. Status MP: ${statusPagamento}, Status DB: ${pedidoExistente.status_pedido}. Nenhuma ação necessária.`);
                return pedidoExistente;
            }
        }

    } catch (error) {
      console.error(`[processarNovoPedido] ERRO FATAL ao processar ${paymentId}:`, error);
        throw error; 
    }
};


exports.criarPreferencia = async (req, res) => {
    try {
        const { cartItems, shippingCost, deliveryOption, selectedAddressId, clienteId } = req.body;
        
        if (!clienteId) {
            return res.status(400).json({ message: "O clienteId é obrigatório." });
        }

        const usuario = await usuarioModel.findById(clienteId);
        if (!usuario) {
            return res.status(404).json({ message: "Usuário (pagador) não encontrado." });
        }
        const carrinho = await carrinhoModel.buscarCarrinhoAtivo(clienteId);
        if (!carrinho || !carrinho.id_carrinho) {
            return res.status(404).json({ message: "Carrinho ativo não encontrado para este usuário." });
        }
        const id_carrinho = carrinho.id_carrinho;

        const itensValidos = cartItems.filter(item => 
            item.quantidade && parseFloat(item.quantidade) > 0 &&
            item.preco_unitario && parseFloat(item.preco_unitario) > 0
        );

        if (itensValidos.length === 0) {
            return res.status(400).json({ message: "Carrinho está vazio ou não contém itens com quantidade válida." });
        }

        const items = itensValidos.map(item => ({
            id: item.id_item_carrinho.toString(),
            title: item.nome_produto,
            quantity: parseInt(item.quantidade, 10), 
            currency_id: 'BRL',
            unit_price: parseFloat(item.preco_unitario)
        }));

        const enderecoParaSalvar = deliveryOption === 'retirada' ? null : selectedAddressId;
        
        const externalReferenceObj = {
            clienteId: clienteId,
            enderecoId: enderecoParaSalvar,
            id_carrinho: id_carrinho 
        };

        const payer = {
            name: usuario.nome,
        };

        const preferenceBody = {
            items: items, 
            payer: payer,
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
        console.log("Enviando preferência para o Mercado Pago:", JSON.stringify(preferenceBody, null, 2)); 
        const response = await preference.create({ body: preferenceBody });
        
        res.json({ 
            id: response.id,
            init_point: response.init_point
        });

    } catch (error) {
        console.error("Erro ao criar preferência de pagamento:", error);
        res.status(500).json({ message: "Erro ao criar pagamento." });
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