// backend/controllers/dashboardController.js
const db = require('../config/db');

async function getKpiData(req, res) {
  try {
    const [totalPedidosResult] = await db.execute('SELECT COUNT(*) AS total FROM pedido');
    
    // Total de pedidos com data de entrega futura (Ativos)
    const [pedidosAtivosResult] = await db.execute('SELECT COUNT(*) AS total FROM pedido WHERE data_entrega >= CURDATE()'); 
    
    // Total de pedidos com data de entrega passada (Fechados/Concluídos)
    const [pedidosFechadosResult] = await db.execute('SELECT COUNT(*) AS total FROM pedido WHERE data_entrega < CURDATE()');
    
    // CORREÇÃO: Pedidos Previstos (entrega nos próximos 7 dias). Substitui a VIEW.
    const [pedidosPrevistosResult] = await db.execute(`
      SELECT COUNT(*) AS total 
      FROM pedido 
      WHERE data_entrega BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    `);

    res.json({
      totalPedidos: totalPedidosResult[0].total,
      pedidosAtivos: pedidosAtivosResult[0].total,
      pedidosFechados: pedidosFechadosResult[0].total,
      pedidosPrevistos: pedidosPrevistosResult[0].total
    });

  } catch (error) {
    console.error('Erro ao buscar dados de KPIs:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

async function getBestSellers(req, res) {
    try {
        // CORREÇÃO: SQL explícito para substituir a view 'vw_produtos_mais_vendidos'
        const query = `
            SELECT 
                pr.nome, 
                SUM(ip.quantidade) AS total_vendido 
            FROM itempedido ip 
            JOIN produto pr ON ip.fk_produto_id_produto = pr.id_produto
            GROUP BY pr.nome
            ORDER BY total_vendido DESC
            LIMIT 4;
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar produtos mais vendidos:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

async function getMonthlyRevenue(req, res) {
    try {
        const { period } = req.query;
        let query = '';

        if (period === 'semiannual') {
            query = `
                SELECT 
                    DATE_FORMAT(p.dataPedido, '%Y-%m') AS mes,
                    SUM(i.precoUnitario * i.quantidade) AS total_faturado
                FROM pedido p
                JOIN itempedido i ON p.id_pedido = i.fk_pedido_id_pedido
                WHERE p.dataPedido >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
                GROUP BY mes
                ORDER BY mes ASC;
            `;
        } else if (period === 'annual') {
            query = `
                SELECT 
                    DATE_FORMAT(p.dataPedido, '%Y-%m') AS mes,
                    SUM(i.precoUnitario * i.quantidade) AS total_faturado
                FROM pedido p
                JOIN itempedido i ON p.id_pedido = i.fk_pedido_id_pedido
                WHERE p.dataPedido >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
                GROUP BY mes
                ORDER BY mes ASC;
            `;
        } else { // Padrão: mensal (último mês)
            query = `
                SELECT 
                    DATE_FORMAT(p.dataPedido, '%Y-%m') AS mes,
                    SUM(i.precoUnitario * i.quantidade) AS total_faturado
                FROM pedido p
                JOIN itempedido i ON p.id_pedido = i.fk_pedido_id_pedido
                WHERE p.dataPedido >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
                GROUP BY mes
                ORDER BY mes ASC;
            `;
        }

        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar faturamento mensal:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

async function getRecentOrders(req, res) {
    try {
        // CORREÇÃO: Uso de LEFT JOIN para evitar que pedidos sejam excluídos se o cliente ou produto estiver faltando (inconsistência de seed)
        const query = `
            SELECT 
                p.id_pedido, 
                p.dataPedido, 
                c.nome AS cliente, 
                fp.status_transacao AS status,
                SUM(ip.precoUnitario * ip.quantidade) AS valor_total_pedido,
                GROUP_CONCAT(pr.nome SEPARATOR ', ') AS nome_produtos
            FROM pedido p
            LEFT JOIN cliente c ON p.fk_cliente_id_cliente = c.id_cliente
            LEFT JOIN forma_pagamento fp ON p.fk_forma_pagamento_id_forma_pagamento = fp.id_forma_pagamento
            LEFT JOIN itempedido ip ON p.id_pedido = ip.fk_pedido_id_pedido
            LEFT JOIN produto pr ON ip.fk_produto_id_produto = pr.id_produto
            GROUP BY p.id_pedido, p.dataPedido, c.nome, fp.status_transacao
            ORDER BY p.dataPedido DESC
            LIMIT 6;
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar pedidos recentes:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

async function getOrderDetails(req, res) {
    try {
        const { id } = req.params;
         // CORREÇÃO: Uso de LEFT JOIN para robustez nos detalhes
        const query = `
            SELECT
                p.id_pedido,
                p.dataPedido,
                p.data_entrega,
                c.nome AS cliente,
                c.email AS email_cliente,
                fp.descricao AS forma_pagamento,
                fp.status_transacao AS status_pagamento,
                e.nome AS nome_endereco,
                e.numero AS numero_endereco,
                e.complemento AS complemento_endereco,
                cid.nome AS nome_cidade,
                cid.sigla_UF AS uf,
                ip.quantidade,
                ip.precoUnitario,
                pr.nome AS nome_produto,
                pr.descricao AS descricao_produto
            FROM pedido p
            LEFT JOIN cliente c ON p.fk_cliente_id_cliente = c.id_cliente
            LEFT JOIN forma_pagamento fp ON p.fk_forma_pagamento_id_forma_pagamento = fp.id_forma_pagamento
            LEFT JOIN endereco e ON p.fk_endereco_id_endereco = e.id_endereco
            LEFT JOIN cidade cid ON e.id_cidade = cid.id_cidade
            LEFT JOIN itempedido ip ON p.id_pedido = ip.fk_pedido_id_pedido
            LEFT JOIN produto pr ON ip.fk_produto_id_produto = pr.id_produto
            WHERE p.id_pedido = ?;
        `;
        const [rows] = await db.execute(query, [id]);
        
        if (rows.length > 0) {
            const orderDetails = {
                id_pedido: rows[0].id_pedido,
                dataPedido: rows[0].dataPedido,
                data_entrega: rows[0].data_entrega,
                cliente: rows[0].cliente,
                email_cliente: rows[0].email_cliente,
                forma_pagamento: rows[0].forma_pagamento,
                status_pagamento: rows[0].status_pagamento,
                endereco: {
                    nome: rows[0].nome_endereco,
                    numero: rows[0].numero_endereco,
                    complemento: rows[0].complemento_endereco,
                    cidade: rows[0].nome_cidade,
                    uf: rows[0].uf
                },
                itens: rows.map(row => ({
                    nome_produto: row.nome_produto,
                    descricao_produto: row.descricao_produto,
                    quantidade: row.quantidade,
                    precoUnitario: row.precoUnitario
                }))
            };
            res.json(orderDetails);
        } else {
            res.status(404).json({ message: 'Pedido não encontrado.' });
        }

    } catch (error) {
        console.error("Erro ao buscar detalhes do pedido:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
}

module.exports = {
  getKpiData,
  getBestSellers,
  getMonthlyRevenue,
  getRecentOrders,
  getOrderDetails
};