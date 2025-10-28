const mercadopago = require('mercadopago');

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
    success: 'http://localhost:3000/pedido/sucesso', // URL para onde o usuário volta
    failure: 'http://localhost:3000/pedido/falha',
    pending: 'http://localhost:3000/pedido/pendente',
  },
  auto_return: 'approved',
            locale: 'pt-BR',
           
        };

        const preference = new Preference(client);
        
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