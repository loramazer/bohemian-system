<<<<<<< Updated upstream
<<<<<<< Updated upstream
/*const mercadopago = require('mercadopago');
=======
// backend/controllers/pagamentoController.js
>>>>>>> Stashed changes
=======
// backend/controllers/pagamentoController.js
>>>>>>> Stashed changes
require('dotenv').config();

// 1. MUDANÇA NA IMPORTAÇÃO (SDK v3)
const { MercadoPagoConfig, Preference } = require('mercadopago');

// 2. MUDANÇA NA INICIALIZAÇÃO (SDK v3)
// Cria um 'cliente' com as suas credenciais
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

exports.criarPreferencia = async (req, res) => {
    try {
        const { cartItems, shippingCost, deliveryOption, selectedAddressId } = req.body;
        
        const items = cartItems.map(item => ({
            id: item.id_produto,
            title: item.nome,
            description: item.descricao || item.nome,
            picture_url: item.imagem_url,
            quantity: item.quantidade,
            currency_id: 'BRL',
            unit_price: parseFloat(item.preco_unitario)
        }));

        // 3. MUDANÇA NA CRIAÇÃO DO BODY (SDK v3)
        // O objeto da preferência agora vai dentro de 'body'
        const preferenceBody = {
            items: items,
            
            ...(shippingCost > 0 && {
                shipments: {
                    cost: parseFloat(shippingCost),
                    mode: 'not_specified', 
                }
            }),

            back_urls: {
                success: 'http://localhost:5173/order-confirmed',
                failure: 'http://localhost:5173/cart',
                pending: 'http://localhost:5173/cart',
            },
            locale: 'pt-BR',
            //auto_return: 'approved',
            // external_reference: 'ID_DO_PEDIDO_NO_SEU_BANCO', 
        };

        // 4. MUDANÇA NA CHAMADA DA API (SDK v3)
        // Instancia a classe Preference com o 'client'
        const preference = new Preference(client);
        
        // Cria a preferência passando o 'body'
        const response = await preference.create({ body: preferenceBody });

        // 5. MUDANÇA NO ACESSO À RESPOSTA (SDK v3)
        // Os dados agora vêm direto no 'response', não em 'response.body'
        res.json({ 
            id: response.id,
            init_point: response.sandbox_init_point 
        });

    } catch (error) {
        // O erro do v3 pode ser mais detalhado
        console.error("Erro ao criar preferência de pagamento:", error);
        res.status(500).json({ message: "Erro ao criar pagamento." });
    }
};*/