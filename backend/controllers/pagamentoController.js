const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const pool = require('../config/db.js'); // Seu pool do mysql2

// --- DEBUG TOKEN ---
console.log("Token de Acesso sendo usado:", process.env.MERCADOPAGO_ACCESS_TOKEN);
// -------------------

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// --- FUNÇÃO INTERNA (AGORA COM SINTAXE MYSQL) ---
const processarPagamentoAprovado = async (paymentId) => {
    try {
        console.log(`[processarPagamentoAprovado] Iniciando processo para PaymentID: ${paymentId}`);

        // ETAPA 1: VERIFICAR DUPLICIDADE
        const [pedidoExistente] = await pool.query(
            `SELECT * FROM pedido WHERE id_pedido = ?`,
            [paymentId.toString()]
        );

        if (pedidoExistente.length > 0) {
            console.log(`[processarPagamentoAprovado] Pedido ${paymentId} já foi processado. Ignorando.`);
            return pedidoExistente[0]; 
        }

        // ETAPA 2: BUSCAR PAGAMENTO NO MERCADO PAGO
        const payment = new Payment(client);
        console.log(`[processarPagamentoAprovado] Verificando ${paymentId} no Mercado Pago...`);
        const pagamentoInfo = await payment.get({ id: paymentId });

        if (pagamentoInfo.status === 'approved') {
            console.log(`[processarPagamentoAprovado] Pagamento ${paymentId} Aprovado.`);

            // ETAPA 3: EXTRAIR DADOS DO EXTERNAL_REFERENCE
            if (!pagamentoInfo.external_reference) {
                throw new Error(`Pagamento ${paymentId} aprovado, mas sem external_reference.`);
            }

            const { clienteId, enderecoId } = JSON.parse(pagamentoInfo.external_reference);
            console.log(`[processarPagamentoAprovado] Dados extraídos: clienteId=${clienteId}, enderecoId=${enderecoId}`);
            
            if (clienteId == null) {
                throw new Error(`clienteId está nulo ou indefinido na external_reference.`);
            }

            // ETAPA 4: INSERIR NA TABELA forma_pagamento
            const [novaFormaPagamentoResult] = await pool.query(
                `INSERT INTO forma_pagamento (id_transacao_mp, status_transacao, data_pagamento, descricao, qr_code_url) VALUES (?, ?, ?, ?, ?)`,
                [
                    pagamentoInfo.id.toString(),
                    pagamentoInfo.status,
                    pagamentoInfo.date_approved,
                    pagamentoInfo.payment_method_id,
                    pagamentoInfo.point_of_interaction?.transaction_data?.qr_code_url
                ]
            );
            
            const novoFormaPagamentoId = novaFormaPagamentoResult.insertId;
            console.log(`[processarPagamentoAprovado] Pagamento salvo na tabela forma_pagamento com ID: ${novoFormaPagamentoId}`);

            // ETAPA 5: INSERIR NA TABELA pedido
            // MUDANÇA: Adicionado 'dataPedido' no INSERT e 'new Date()' nos valores
            const [novoPedidoResult] = await pool.query(
               `INSERT INTO pedido (id_pedido, fk_cliente_id_cliente, fk_forma_pagamento_id_forma_pagamento, fk_endereco_id_endereco, dataPedido) VALUES (?, ?, ?, ?, ?)`,
                [
                    pagamentoInfo.id.toString(), // id_pedido
                    clienteId,                     // fk_cliente_id_cliente
                    novoFormaPagamentoId,          // fk_forma_pagamento...
                    enderecoId,                    // fk_endereco...
                    new Date()                     // dataPedido (a data/hora atual)
                ]
            );
            
            const pedidoSalvo = { id_pedido: pagamentoInfo.id.toString() }; 
            console.log('[processarPagamentoAprovado] Pedido salvo no banco:', pedidoSalvo.id_pedido);
            return pedidoSalvo;

        } else {
            console.log(`[processarPagamentoAprovado] Pagamento ${paymentId} não está 'approved'. Status: ${pagamentoInfo.status}`);
            return null; 
        }
    } catch (error) {
        console.error(`[processarPagamentoAprovado] ERRO FATAL ao processar ${paymentId}:`, error);
        throw error; 
    }
};
// =================================================================


// --- CONTROLLER 'criarPreferencia' (Nenhuma mudança necessária, não usa SQL) ---
// =================================================================
exports.criarPreferencia = async (req, res) => {
    try {
        const { cartItems, shippingCost, deliveryOption, selectedAddressId, clienteId } = req.body;
        
        if (!clienteId) {
            return res.status(400).json({ message: "O clienteId é obrigatório." });
        }

        const items = cartItems.map(item => ({
            id: item.id_item_carrinho.toString(),
            title: item.nome_produto,
            description: item.descricao || item.nome_produto,
            picture_url: item.imagem_url,
            quantity: item.quantidade,
            currency_id: 'BRL',
            unit_price: parseFloat(item.preco_unitario)
        }));

        const enderecoParaSalvar = deliveryOption === 'retirada' ? null : selectedAddressId;
        const externalReferenceObj = {
            clienteId: clienteId,
            enderecoId: enderecoParaSalvar
        };

        // ATUALIZE SUAS URLs DE BACK_URLS para a URL de PRODUÇÃO ou NGROK
        const suaUrlBase = process.env.BASE_URL || 'http://localhost:3000'; 

        const preferenceBody = {
            items: items,
            ...(shippingCost > 0 && { 
                shipments: {
                    cost: parseFloat(shippingCost),
                    mode: 'not_specified', 
                }
            }),
            back_urls: {
                success: `${suaUrlBase}/pedido/sucesso`, 
                failure: `${suaUrlBase}/pedido/falha`,
                pending: `${suaUrlBase}/pedido/pendente`,
            },
            auto_return: 'approved',
            external_reference: JSON.stringify(externalReferenceObj),
            locale: 'pt-BR',
        };

        const preference = new Preference(client);
        console.log("Enviando preferência para o Mercado Pago...");
        const response = await preference.create({ body: preferenceBody });

        res.json({ 
            id: response.id,
            // Lembre-se: use 'init_point' para Produção
            init_point: response.init_point 
        });

    } catch (error) {
        console.error("Erro ao criar preferência de pagamento:", error);
        res.status(500).json({ message: "Erro ao criar pagamento." });
    }
};


// --- CONTROLLER 'confirmarPedido' (Nenhuma mudança necessária, não usa SQL) ---
// =================================================================
exports.confirmarPedido = async (req, res) => {
    try {
        const { paymentId } = req.body;
        console.log(`[confirmarPedido] Recebido do frontend: ${paymentId}`);

        if (!paymentId) {
            return res.status(400).send('paymentId é obrigatório.');
        }

        const pedidoSalvo = await processarPagamentoAprovado(paymentId);

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


// --- CONTROLLER 'receberWebhook' (Nenhuma mudança necessária, não usa SQL) ---
// =================================================================
exports.receberWebhook = async (req, res) => {
    console.log("--- WEBHOOK RECEBIDO ---");
    
    try {
        const paymentId = req.body.data?.id;
        const type = req.body.type;

        if (type === 'payment' && paymentId) {
            console.log(`[receberWebhook] Processando PaymentID: ${paymentId}`);
            await processarPagamentoAprovado(paymentId);
        } else {
            console.log("[receberWebhook] Notificação não é do tipo 'payment', ignorando.");
        }
        res.status(200).send("Webhook recebido.");

    } catch (error) {
        console.error("Erro ao processar webhook:", error.message);
        res.status(200).send("Erro interno registrado, webhook descartado.");
    }
};