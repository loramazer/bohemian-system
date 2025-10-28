// Exemplo em Node.js (Express)
// (Usando o mesmo client do SDK do Mercado Pago)
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: env.MP_ACCESS_TOKEN });
const payment = new Payment(client);

app.post('/api/confirmar-pedido', async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).send('paymentId não fornecido.');
    }

    // 1. VERIFICAÇÃO DE SEGURANÇA
    // Busca o pagamento na API do MP para garantir que ele é real e foi aprovado
    console.log(`Verificando pagamento ${paymentId} no Mercado Pago...`);
    const pagamentoInfo = await payment.get({ id: paymentId });
    
    // 2. SE APROVADO, SALVA NO BANCO
    if (pagamentoInfo.status === 'approved') {
      console.log('Pagamento aprovado. Inserindo no banco de dados...');
      
      // --- SEU CÓDIGO DE BANCO DE DADOS VEM AQUI ---
      const novoPedido = await pool.query( "INSERT INTO pedido (id_pedido, fk_cliente_id_cliente, fk_forma_pagamento_id_forma_pagamento, fk_endereco_id_endereco) VALUES ($1, $2, $3, $4) RETURNING id_pedido", [
    pagamentoInfo.id, // ou seu ID interno
           pagamentoInfo.payer.id, // ID do cliente
          pagamentoInfo.payment_method_id, // ex: 'visa'
           pagamentoInfo.status // 'approved'
         ]
      // );
      //
      // ---------------------------------------------
      );
      
      // Simulação de salvamento no banco:
      const pedidoSalvo = { id: 1001, status: 'Salvo' }; 
      
      console.log('Pedido salvo no banco:', pedidoSalvo.id);
      
      // 3. Retorna o pedido salvo para o front-end
      return res.status(201).json(pedidoSalvo);

    } else {
      // Se alguém tentar forjar a URL, o status não será 'approved'
      console.warn('Pagamento não aprovado ou não encontrado:', paymentId);
      return res.status(400).send('Pagamento não aprovado.');
    }

  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    return res.status(500).send('Erro interno do servidor.');
  }
});