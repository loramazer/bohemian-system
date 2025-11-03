// backend/controllers/pagamentoController.js

const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const pool = require('../config/db.js'); // Seu pool do mysql2
const carrinhoModel = require('../models/carrinhoModel');
const itemCarrinhoModel = require('../models/itemCarrinhoModel'); // Importe o itemCarrinhoModel

// --- DEBUG TOKEN ---
console.log("Token de Acesso sendo usado:", process.env.MERCADOPAGO_ACCESS_TOKEN);
// -------------------

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// =================================================================
// FUNÇÃO INTERNA (Já corrigida para MySQL e para salvar itens)
// =================================================================
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

        // ETAPA 2: BUSCAR PAGAMENTO NO MP
        const payment = new Payment(client);
        console.log(`[processarPagamentoAprovado] Verificando ${paymentId} no Mercado Pago...`);
        const pagamentoInfo = await payment.get({ id: paymentId });

        if (pagamentoInfo.status === 'approved') {
            console.log(`[processarPagamentoAprovado] Pagamento ${paymentId} Aprovado.`);

            // ETAPA 3: EXTRAIR DADOS DO EXTERNAL_REFERENCE
            if (!pagamentoInfo.external_reference) {
                throw new Error(`Pagamento ${paymentId} aprovado, mas sem external_reference.`);
            }
            const { clienteId, enderecoId, id_carrinho } = JSON.parse(pagamentoInfo.external_reference);
            
            if (clienteId == null || id_carrinho == null) {
                throw new Error(`clienteId ou id_carrinho faltando na external_reference.`);
            }
            console.log(`[processarPagamentoAprovado] Dados extraídos: clienteId=${clienteId}, carrinhoId=${id_carrinho}`);

            // ETAPA 4: INSERIR NA forma_pagamento
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

            // ETAPA 5: INSERIR NA pedido (Usando o nome de coluna 'fk_id_usuario' que corrigimos)
            const [novoPedidoResult] = await pool.query(
               `INSERT INTO pedido (id_pedido, fk_id_usuario, fk_forma_pagamento_id_forma_pagamento, fk_endereco_id_endereco, dataPedido) VALUES (?, ?, ?, ?, ?)`,
                [pagamentoInfo.id.toString(), clienteId, novoFormaPagamentoId, enderecoId, new Date()]
            );
            const idPedidoCriado = pagamentoInfo.id.toString();

            // --- ETAPA 6: MOVER ITENS DO CARRINHO PARA O PEDIDO ---
            console.log(`[processarPagamentoAprovado] Movendo itens do carrinho ${id_carrinho} para o pedido ${idPedidoCriado}`);

            // 6a. Buscar itens do carrinho
            const itensDoCarrinho = await itemCarrinhoModel.listarItens(id_carrinho);
            if (itensDoCarrinho.length === 0) {
                console.warn(`[processarPagamentoAprovado] Carrinho ${id_carrinho} estava vazio.`);
            }

            // 6b. Preparar o bulk insert para 'itempedido'
            const itensParaPedido = itensDoCarrinho.map(item => [
                idPedidoCriado,
                item.id_produto,
                item.quantidade,
                item.preco_unitario
            ]);

            const sqlInsertItens = 'INSERT INTO itempedido (fk_pedido_id_pedido, fk_produto_id_produto, quantidade, precoUnitario) VALUES ?';
            if (itensParaPedido.length > 0) {
                await pool.query(sqlInsertItens, [itensParaPedido]);
                console.log(`[processarPagamentoAprovado] ${itensParaPedido.length} itens salvos em itempedido.`);
            }

            // 6c. Esvaziar o carrinho original
            await itemCarrinhoModel.esvaziar(id_carrinho);
            console.log(`[processarPagamentoAprovado] Carrinho ${id_carrinho} esvaziado.`);
            
            const pedidoSalvo = { id_pedido: idPedidoCriado }; 
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


// =================================================================
// --- CONTROLLER 'criarPreferencia' CORRIGIDO ---
// =================================================================
exports.criarPreferencia = async (req, res) => {
    try {
        const { cartItems, shippingCost, deliveryOption, selectedAddressId, clienteId } = req.body;
        
        if (!clienteId) {
            return res.status(400).json({ message: "O clienteId é obrigatório." });
        }

        const carrinho = await carrinhoModel.buscarCarrinhoAtivo(clienteId);
        if (!carrinho || !carrinho.id_carrinho) {
            return res.status(404).json({ message: "Carrinho ativo não encontrado para este usuário." });
        }
        const id_carrinho = carrinho.id_carrinho;

        // --- CORREÇÃO 1: FILTRAR ITENS INVÁLIDOS ---
        // Isso corrige o erro 'quantity needed' que você recebeu.
        const itensValidos = cartItems.filter(item => 
            item.quantidade && parseFloat(item.quantidade) > 0 &&
            item.preco_unitario && parseFloat(item.preco_unitario) > 0
        );

        if (itensValidos.length === 0) {
            return res.status(400).json({ message: "Carrinho está vazio ou não contém itens com quantidade válida." });
        }

        // --- CORREÇÃO 2: ADICIONAR 'quantity' AO MAPA ---
        const items = itensValidos.map(item => ({
            id: item.id_item_carrinho.toString(),
            title: item.nome_produto,
            quantity: parseInt(item.quantidade, 10), // <-- ESTAVA FALTANDO
            currency_id: 'BRL',
            unit_price: parseFloat(item.preco_unitario)
        }));

        const enderecoParaSalvar = deliveryOption === 'retirada' ? null : selectedAddressId;
        
        const externalReferenceObj = {
            clienteId: clienteId,
            enderecoId: enderecoParaSalvar,
            id_carrinho: id_carrinho 
        };

        // --- CORREÇÃO 3: LIMPAR O CORPO DA PREFERÊNCIA ---
        // Removida a chave 'items' duplicada e o código misturado
        const preferenceBody = {
            items: items, // Usa o 'items' que acabamos de criar
            back_urls: {
                success: `${process.env.FRONTEND_URL}/order-confirmed?status=success`,
                failure: `${process.env.FRONTEND_URL}/order-confirmed?status=failure`,
                pending: `${process.env.FRONTEND_URL}/order-confirmed?status=pending`,
            },
            auto_return: 'approved',
            external_reference: JSON.stringify(externalReferenceObj),
        };
      
        const preference = new Preference(client);
        // Adicionando log para depuração
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


// =================================================================
// --- CONTROLLER 'confirmarPedido' (Sem mudanças) ---
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


// =================================================================
// --- CONTROLLER 'receberWebhook' (Sem mudanças) ---
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