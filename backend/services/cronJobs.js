// backend/services/cronJobs.js
const cron = require('node-cron');
const db = require('../config/db'); // Importe sua conexão com o banco (MySQL)

// Função que configura as tarefas agendadas
const iniciarCronJobs = () => {
    
    // Agendamento: "0 0 * * *" significa "Todo dia à 00:00 (meia-noite)"
    cron.schedule('*/5 * * * *', async () => {
        console.log('⏰ Iniciando varredura de pedidos pendentes expirados...');

        try {
            // 1. Calcular a data de 7 dias atrás
            // Se for MySQL puro, podemos fazer direto na Query, mas aqui fica a lógica:
            const seteDiasAtras = new Date();
            seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
            
            // Formata para o padrão do MySQL (YYYY-MM-DD HH:mm:ss) se necessário
            const dataCorte = seteDiasAtras.toISOString().slice(0, 19).replace('T', ' ');

            // 2. Query para atualizar os pedidos
            // "UPDATE pedidos SET status = 'cancelled' ONDE status = 'pending' E data < 7 dias atrás"
            
            const query = `
                UPDATE pedidos 
                SET status = 'cancelled' 
                WHERE status = 'pending' 
                AND data_pedido <= ?
            `;

            // Executa a query (ajuste 'db.query' conforme sua config do db.js)
            // Se você usa pool de conexões:
            const [result] = await db.promise().query(query, [dataCorte]);
            
            if (result.affectedRows > 0) {
                console.log(`✅ Sucesso: ${result.affectedRows} pedidos antigos foram cancelados automaticamente.`);
            } else {
                console.log('ℹ️ Nenhum pedido expirado encontrado hoje.');
            }

        } catch (error) {
            console.error('❌ Erro ao rodar cron de cancelamento:', error);
        }
    });

    console.log('🚀 Serviço de Cron Jobs iniciado (Varredura agendada para 00:00).');
};

module.exports = iniciarCronJobs;