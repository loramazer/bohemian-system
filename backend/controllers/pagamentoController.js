/*const mercadopago = require('mercadopago');
require('dotenv').config();

// 1. Configura o SDK do Mercado Pago
mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

exports.criarPreferencia = async (req, res) => {
    try {
        // 2. Recebe os dados do frontend
        const { cartItems, shippingCost, deliveryOption, selectedAddressId } = req.body;
        
        // 3. Formata os itens do carrinho para o Mercado Pago
        const items = cartItems.map(item => ({
            id: item.id_produto,
            title: item.nome, // Nome do produto
            description: item.descricao || item.nome, // Descrição
            picture_url: item.imagem_url,
            quantity: item.quantidade,
            currency_id: 'BRL',
            unit_price: parseFloat(item.preco_unitario) // Preço unitário
        }));

        // 4. Cria o objeto de preferência
        const preference = {
            items: items,
            
            // Adiciona o custo do frete como um item separado
            // (O Mercado Pago não tem um campo de "frete" simples na preferência)
            // Se o frete for 0 (ex: retirada), não adicionamos.
            ...(shippingCost > 0 && {
                shipments: {
                    cost: parseFloat(shippingCost),
                    mode: 'not_specified', 
                }
            }),

            // URLs para onde o usuário será redirecionado
            back_urls: {
                success: 'http://localhost:5173/order-confirmed', // URL do seu frontend
                failure: 'http://localhost:5173/cart', // Volta para o carrinho
                pending: 'http://localhost:5173/cart',
            },
            auto_return: 'approved', // Retorna automaticamente se o pagamento for aprovado
            
            // (Opcional) Podemos salvar o ID do pedido aqui para rastreamento futuro
            // external_reference: 'ID_DO_PEDIDO_NO_SEU_BANCO', 
        };

        // 5. Cria a preferência no Mercado Pago
        const response = await mercadopago.preferences.create(preference);

        // 6. Envia o link de pagamento de volta para o frontend
        // Usamos sandbox_init_point para modo de teste. 
        // Em produção, seria init_point.
        res.json({ 
            id: response.body.id,
            init_point: response.body.sandbox_init_point 
        });

    } catch (error) {
        console.error("Erro ao criar preferência de pagamento:", error);
        res.status(500).json({ message: "Erro ao criar pagamento." });
    }
};*/