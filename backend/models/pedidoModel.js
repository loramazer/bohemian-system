// backend/models/pedidoModel.js
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
    // NOVA ESTRATÉGIA: JOIN Simples e Agrupamento via JavaScript
    // Isso evita erros de JSON do MySQL e garante que os dados venham.

    const query = `
        SELECT 
            p.id_pedido, 
            p.dataPedido, 
            p.data_entrega, 
            p.status_pedido, 
            fp.status_transacao, 
            COALESCE(e.nome, 'Retirada na Loja') AS rua_entrega, 
            e.numero, 
            e.complemento, 
            cid.nome AS cidade, 
            cid.sigla_UF AS estado,
            
            -- Dados do Item
            ip.quantidade AS item_quantidade,
            ip.precoUnitario AS item_preco,
            
            -- Dados do Produto
            pr.id_produto,
            pr.nome AS nome_produto,
            pr.imagem_url
            
        FROM pedido p
        LEFT JOIN itempedido ip ON p.id_pedido = ip.fk_pedido_id_pedido
        LEFT JOIN produto pr ON ip.fk_produto_id_produto = pr.id_produto
        LEFT JOIN forma_pagamento fp ON p.fk_forma_pagamento_id_forma_pagamento = fp.id_forma_pagamento 
        LEFT JOIN endereco e ON p.fk_endereco_id_endereco = e.id_endereco 
        LEFT JOIN cidade cid ON e.id_cidade = cid.id_cidade 
        
        WHERE p.fk_id_usuario = ? 
        ORDER BY p.id_pedido DESC, p.dataPedido DESC;
    `;

    try {
        console.log(`[pedidoModel] Buscando pedidos (RAW) para usuario: ${usuarioId}`);
        const [rows] = await db.execute(query, [usuarioId]);
        
        // Se não veio nada, retorna array vazio
        if (!rows || rows.length === 0) return [];

        // --- LÓGICA DE AGRUPAMENTO (Transforma Linhas em Objetos de Pedido) ---
        const pedidosMap = new Map();

        rows.forEach(row => {
            // Se o pedido ainda não está no mapa, cria a estrutura dele
            if (!pedidosMap.has(row.id_pedido)) {
                pedidosMap.set(row.id_pedido, {
                    id_pedido: row.id_pedido,
                    dataPedido: row.dataPedido,
                    data_entrega: row.data_entrega,
                    status_pedido: row.status_pedido,
                    status: row.status_transacao, // O front espera 'status' para pagamento
                    rua: row.rua_entrega,
                    numero: row.numero,
                    complemento: row.complemento,
                    cidade: row.cidade,
                    estado: row.estado,
                    total_pedido: 0, // Vamos calcular somando os itens
                    itens: []
                });
            }

            const pedidoAtual = pedidosMap.get(row.id_pedido);

            // Se a linha tem um produto válido (pode ser null devido ao LEFT JOIN se o pedido estiver vazio)
            if (row.id_produto) {
                // Adiciona o item ao array
                pedidoAtual.itens.push({
                    id_produto: row.id_produto,
                    nome_produto: row.nome_produto,
                    quantidade: row.item_quantidade,
                    precoUnitario: row.item_preco,
                    imagem_url: parseImageUrl(row.imagem_url)
                });

                // Soma ao total do pedido
                // Converter para float para garantir matemática correta
                const subtotalItem = parseFloat(row.item_preco) * row.item_quantidade;
                pedidoAtual.total_pedido += subtotalItem;
            }
        });

        // Converte o Map de volta para um Array
        const pedidosFormatados = Array.from(pedidosMap.values());
        
        console.log(`[pedidoModel] ${pedidosFormatados.length} pedidos formatados com sucesso.`);
        
        // Debug para ver se o primeiro pedido tem itens
        if(pedidosFormatados.length > 0) {
             console.log(`[DEBUG] Primeiro pedido tem ${pedidosFormatados[0].itens.length} itens.`);
             // Formata o total final para 2 casas decimais (opcional, mas bom para evitar 100.0000001)
             pedidosFormatados.forEach(p => {
                 p.total_pedido = p.total_pedido.toFixed(2);
             });
        }

        return pedidosFormatados;

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