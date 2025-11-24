const cron = require('node-cron');
const db = require('../config/db');

const iniciarCronJobs = () => {
    
    cron.schedule('*/5 * * * *', async () => {
        console.log('⏰ Iniciando varredura de pedidos pendentes expirados...');

        try {
            const seteDiasAtras = new Date();
            seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
            
            const dataCorte = seteDiasAtras.toISOString().slice(0, 19).replace('T', ' ');

            const query = `
                UPDATE pedido 
                SET status_pedido = 'Cancelado' 
                WHERE status_pedido = 'Pendente' 
                AND dataPedido <= ?
            `;

            const [result] = await db.execute(query, [dataCorte]);
            
            if (result.affectedRows > 0) {
                console.log(`✅ Sucesso: ${result.affectedRows} pedidos antigos foram cancelados automaticamente.`);
            } else {
                console.log('ℹ️ Nenhum pedido expirado encontrado hoje.');
            }

        } catch (error) {
            console.error('❌ Erro ao rodar cron de cancelamento:', error);
        }
    });

    console.log('🚀 Serviço de Cron Jobs iniciado (Varredura a cada 5 minutos).');
};

module.exports = iniciarCronJobs;