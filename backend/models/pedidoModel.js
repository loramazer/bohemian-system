const db = require('../config/db');

function parseImageUrl(imageUrlString) {
    try {

        const parsed = JSON.parse(imageUrlString);

        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0];
        }
    } catch (e) {
    }
    return imageUrlString; 
}

async function findByUsuarioId(usuarioId) {

    const query = `SELECT p.id_pedido, p.dataPedido, p.data_entrega, p.status_pedido, fp.status_transacao AS status, COALESCE(e.nome, 'Retirada na Loja') AS rua, e.numero, e.complemento, cid.nome AS cidade, cid.sigla_UF AS estado, (SELECT SUM(ip_inner.precoUnitario * ip_inner.quantidade) FROM itempedido ip_inner WHERE ip_inner.fk_pedido_id_pedido = p.id_pedido) AS total_pedido, JSON_ARRAYAGG( JSON_OBJECT( 'id_produto', pr.id_produto, 'nome_produto', pr.nome, 'quantidade', ip.quantidade, 'precoUnitario', ip.precoUnitario, 'imagem_url', pr.imagem_url ) ) AS itens FROM pedido p LEFT JOIN itempedido ip ON p.id_pedido = ip.fk_pedido_id_pedido LEFT JOIN produto pr ON ip.fk_produto_id_produto = pr.id_produto LEFT JOIN forma_pagamento fp ON p.fk_forma_pagamento_id_forma_pagamento = fp.id_forma_pagamento LEFT JOIN endereco e ON p.fk_endereco_id_endereco = e.id_endereco LEFT JOIN cidade cid ON e.id_cidade = cid.id_cidade WHERE p.fk_id_usuario = ? GROUP BY p.id_pedido, p.dataPedido, p.data_entrega, p.status_pedido, fp.status_transacao, e.nome, e.numero, e.complemento, cid.nome, cid.sigla_UF ORDER BY p.dataPedido DESC;`;

    try {
        console.log(`[pedidoModel] Buscando pedidos para o usuário ID: ${usuarioId}`);
        const [rows] = await db.execute(query, [usuarioId]);
        console.log(`[pedidoModel] Query executada, ${rows.length} pedidos encontrados.`);

        if (rows.length === 0) {
            return [];
        }

        return rows.map(order => {
            const itemsArray = (typeof order.itens === 'string' ? JSON.parse(order.itens) : order.itens) || [];
            
            return {
                ...order,
                itens: itemsArray.filter(item => item.id_produto != null).map(item => ({ // Filtra itens nulos
                    ...item,
                    imagem_url: parseImageUrl(item.imagem_url)
                }))
            }
        });

    } catch (error) {
        console.error("Erro crítico no agrupamento de pedidos:", error);
        throw error;
    }
}

async function findAllAdmin(options) {
    const { page = 1, limit = 10, status, search, startDate, endDate } = options;
    const FRETE_FIXO = 15.00;

    let params = [];
    let countParams = [];
    let whereClauses = [];

    let baseSql = `FROM pedido p JOIN usuario u ON p.fk_id_usuario = u.id_usuario JOIN forma_pagamento fp ON p.fk_forma_pagamento_id_forma_pagamento = fp.id_forma_pagamento LEFT JOIN itempedido ip ON p.id_pedido = ip.fk_pedido_id_pedido`;

    if (status) {
        whereClauses.push(`fp.status_transacao = ?`);
        params.push(status);
        countParams.push(status);
    }
    if (search) {
        whereClauses.push(`u.nome LIKE ?`);
        const searchParam = `%${search}%`;
        params.push(searchParam);
        countParams.push(searchParam);
    }
    if (startDate) {
        whereClauses.push(`p.dataPedido >= ?`);
        params.push(startDate);
        countParams.push(startDate);
    }
    if (endDate) {
        whereClauses.push(`p.dataPedido <= ?`);
        params.push(endDate);
        countParams.push(endDate);
    }

    const whereSql = whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(DISTINCT p.id_pedido) as totalPedidos ${baseSql} ${whereSql}`;
    
    const [countResult] = await db.execute(countSql, countParams);
    const totalPedidos = countResult[0].totalPedidos;
    const totalPages = Math.ceil(totalPedidos / limit);


    let sql = `SELECT p.id_pedido, p.dataPedido, u.nome AS cliente_nome, fp.status_transacao AS status, p.status_pedido AS status_pedido, (SELECT SUM(ip_inner.precoUnitario * ip_inner.quantidade) FROM itempedido ip_inner WHERE ip_inner.fk_pedido_id_pedido = p.id_pedido) + ${FRETE_FIXO} AS total_pedido ${baseSql} ${whereSql} GROUP BY p.id_pedido, p.dataPedido, u.nome, fp.status_transacao, p.status_pedido ORDER BY p.dataPedido DESC`;

    const offset = (page - 1) * limit;
    sql += ` LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    const [pedidos] = await db.execute(sql, params);

    return {
        pedidos: pedidos.map(p => ({
            ...p,
            total_pedido: p.total_pedido ? parseFloat(p.total_pedido).toFixed(2) : '0.00'
        })),
        totalPages,
        totalPedidos,
        currentPage: parseInt(page)
    };
}

async function updateOrderStatus(pedidoId, statusPedido) {
    const sql = `UPDATE pedido SET status_pedido = ? WHERE id_pedido = ?`;
    const [result] = await db.execute(sql, [statusPedido, pedidoId]);
return result.affectedRows;
}
async function atualizarStatusPagamento(paymentId, statusPagamento, statusPedido, dataPagamento) { 
    
    const sqlUpdateFormaPagamento = `UPDATE forma_pagamento fp JOIN pedido p ON fp.id_forma_pagamento = p.fk_forma_pagamento_id_forma_pagamento SET fp.status_transacao = ?, fp.data_pagamento = ? WHERE p.id_pedido = ?`;
    
    await db.execute(sqlUpdateFormaPagamento, [statusPagamento, dataPagamento, paymentId]);
    console.log(`[pedidoModel] Status do pagamento (forma_pagamento) atualizado para ${statusPagamento} para o pedido ${paymentId}.`);

    const sqlUpdatePedido = `UPDATE pedido SET status_pedido = ? WHERE id_pedido = ?`;
    
    const [result] = await db.execute(sqlUpdatePedido, [statusPedido, paymentId]);
    console.log(`[pedidoModel] Status do pedido (pedido) atualizado para ${statusPedido} para o pedido ${paymentId}.`);

    return result.affectedRows;
}


module.exports = { 
    findByUsuarioId,
    findAllAdmin,
    atualizarStatusPagamento,
    updateOrderStatus
};