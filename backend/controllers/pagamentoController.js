// controllers/pagamentoController.js

// 1. MUDANÇA: Use 'require'
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const pool = require('../config/db.js'); // IMPORTANTE: Verifique se este é o caminho correto para seu 'pool'

// 2. MUDANÇA: Não precisa de 'dotenv' aqui
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// 3. MUDANÇA: Use 'exports.nomeFuncao'
exports.criarPreferencia = async (req, res) => {
    try {
        const { cartItems, shippingCost, deliveryOption, selectedAddressId } = req.body;
        console.log("Dados recebidos do frontend (cartItems):", JSON.stringify(cartItems, null, 2));
        const items = cartItems.map(item => ({
            id: item.id_item_carrinho.toString(),
            title: item.nome_produto,
            description: item.descricao || item.nome_produto,
            picture_url: item.imagem_url,
            quantity: item.quantidade,
            currency_id: 'BRL',
            unit_price: parseFloat(item.preco_unitario)
        }));

        // --- ESTE É O BLOCO IMPORTANTE ---
        const preferenceBody = {
            items: items,
            ...(shippingCost > 0 && {
                shipments: {
                    cost: parseFloat(shippingCost),
                    mode: 'not_specified', 
                }
            }),
            back_urls: {
                success: 'http://localhost:3000/pedido/sucesso', 
                failure: 'http://localhost:3000/pedido/falha',
                pending: 'http://localhost:3000/pedido/pendente',
            },
            auto_return: 'approved',
            locale: 'pt-BR',
        };
        // ---------------------------------
        console.log("Objeto de preferência a ser enviado:", JSON.stringify(preferenceBody, null, 2));
        const preference = new Preference(client);
        console.log("Enviando preferência para o Mercado Pago..."); // Adicionei este log
        const response = await preference.create({ body: preferenceBody });

        res.json({ 
            id: response.id,
            init_point: response.sandbox_init_point 
        });

    } catch (error) {
        console.error("Erro ao criar preferência de pagamento:", error);
        res.status(500).json({ message: "Erro ao criar pagamento." });
    }
};

// 4. MUDANÇA: Use 'exports.nomeFuncao'
exports.confirmarPedido = async (req, res) => {
    try {
        const { paymentId, clienteId, formaPagamentoId, enderecoId } = req.body;

        if (!paymentId || !clienteId || !formaPagamentoId) {
            return res.status(400).send('Dados insuficientes para confirmar o pedido.');
        }

        const payment = new Payment(client);
        console.log(`Verificando pagamento ${paymentId} no Mercado Pago...`);
        const pagamentoInfo = await payment.get({ id: paymentId });
        
        if (pagamentoInfo.status === 'approved') {
            console.log('Pagamento aprovado. Inserindo no banco de dados...');
            
            const novoPedido = await pool.query(
               `INSERT INTO pedido (
                   id_pedido, 
                   fk_cliente_id_cliente, 
                   fk_forma_pagamento_id_forma_pagamento, 
                   fk_endereco_id_endereco
                ) VALUES ($1, $2, $3, $4) RETURNING id_pedido`,
                [
                    pagamentoInfo.id,
                    clienteId,
                    formaPagamentoId,
                    enderecoId
                ]
            );
            
            const pedidoSalvo = novoPedido.rows[0];
            console.log('Pedido salvo no banco:', pedidoSalvo.id_pedido);
            
            return res.status(201).json(pedidoSalvo);

        } else {
            console.warn('Pagamento não aprovado ou não encontrado:', paymentId);
            return res.status(400).send('Pagamento não aprovado.');
        }

    } catch (error){
        console.error('Erro ao confirmar pagamento:', error);
        return res.status(500).send('Erro interno do servidor.');
    }
};