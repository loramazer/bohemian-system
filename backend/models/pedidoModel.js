// backend/models/pedidoModel.js
const db = require('../config/db');

function parseImageUrl(imageUrlString) {
    try {
        // Tenta parsear a string JSON
        const parsed = JSON.parse(imageUrlString);
        
        // Se for um array e tiver pelo menos uma imagem, retorna a primeira
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0];
        }
    } catch (e) {
        // Se falhar o parse, significa que já é uma URL única (string)
        // Não faz nada e apenas retorna a string original
    }
    // Retorna a string original se não for um array JSON ou se o parse falhar
    return imageUrlString; 
}

async function findByUsuarioId(usuarioId) {
    
    // --- CORREÇÃO: Query SQL "achatada" E com LEFT JOINs ---
    const query = `SELECT p.id_pedido, p.dataPedido, p.data_entrega, p.status_pedido, fp.status_transacao AS status, COALESCE(e.nome, 'Retirada na Loja') AS rua, e.numero, e.complemento, cid.nome AS cidade, cid.sigla_UF AS estado, (SELECT SUM(ip_inner.precoUnitario * ip_inner.quantidade) FROM itempedido ip_inner WHERE ip_inner.fk_pedido_id_pedido = p.id_pedido) AS total_pedido, JSON_ARRAYAGG( JSON_OBJECT( 'id_produto', pr.id_produto, 'nome_produto', pr.nome, 'quantidade', ip.quantidade, 'precoUnitario', ip.precoUnitario, 'imagem_url', pr.imagem_url ) ) AS itens FROM pedido p LEFT JOIN itempedido ip ON p.id_pedido = ip.fk_pedido_id_pedido LEFT JOIN produto pr ON ip.fk_produto_id_produto = pr.id_produto LEFT JOIN forma_pagamento fp ON p.fk_forma_pagamento_id_forma_pagamento = fp.id_forma_pagamento LEFT JOIN endereco e ON p.fk_endereco_id_endereco = e.id_endereco LEFT JOIN cidade cid ON e.id_cidade = cid.id_cidade WHERE p.fk_id_usuario = ? GROUP BY p.id_pedido, p.dataPedido, p.data_entrega, p.status_pedido, fp.status_transacao, e.nome, e.numero, e.complemento, cid.nome, cid.sigla_UF ORDER BY p.dataPedido DESC;`;
    // --- MUDANÇAS: Todos os JOINs (exceto 'pedido') agora são LEFT JOIN ---

    try {
        // Verifique se o seu backend (controller) está passando o ID de usuário correto
        console.log(`[pedidoModel] Buscando pedidos para o usuário ID: ${usuarioId}`);
        const [rows] = await db.execute(query, [usuarioId]);
        console.log(`[pedidoModel] Query executada, ${rows.length} pedidos encontrados.`);

        // Se 'rows' estiver vazio, o frontend mostrará "Nenhum pedido".
        if (rows.length === 0) {
            return [];
        }

        return rows.map(order => {
            // Adiciona uma checagem de segurança para 'itens' que podem ser [null]
            // se um pedido não tiver itens (por causa do LEFT JOIN)
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
        console.error("Erro ao buscar pedidos por usuário no Model:", error);
        throw error;
    }
}


// --- FUNÇÃO ATUALIZADA: findAllAdmin (Inclui status_pedido) ---
async function findAllAdmin(options) {
    const { page = 1, limit = 10, status, search, startDate, endDate } = options;
    const FRETE_FIXO = 15.00;

    let params = [];
    let countParams = [];
    let whereClauses = [];

    // --- CORREÇÃO 2: O JOIN ON foi corrigido ---
    let baseSql = `FROM pedido p JOIN usuario u ON p.fk_id_usuario = u.id_usuario JOIN forma_pagamento fp ON p.fk_forma_pagamento_id_forma_pagamento = fp.id_forma_pagamento LEFT JOIN itempedido ip ON p.id_pedido = ip.fk_pedido_id_pedido`;
    // --- MUDANÇA BEM AQUI ^^^ (de 'fk_cliente_id_cliente' para 'fk_id_usuario') ---

    // --- Filtros Dinâmicos ---
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

    // --- Query de Contagem (Total de Pedidos) ---
    const countSql = `SELECT COUNT(DISTINCT p.id_pedido) as totalPedidos ${baseSql} ${whereSql}`;
    
    const [countResult] = await db.execute(countSql, countParams);
    const totalPedidos = countResult[0].totalPedidos;
    const totalPages = Math.ceil(totalPedidos / limit);

    // --- Query de Busca (Pedidos Paginados) ---
    // (Também achatada para evitar erros de sintaxe)
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
async function atualizarStatusPagamento(paymentId, statusPagamento, statusPedido, dataPagamento) { // <-- 1. NOVO PARÂMETRO 'dataPagamento'
    
    // 2. Atualiza a 'forma_pagamento' (Query Achatada E com data_pagamento)
    const sqlUpdateFormaPagamento = `UPDATE forma_pagamento fp JOIN pedido p ON fp.id_forma_pagamento = p.fk_forma_pagamento_id_forma_pagamento SET fp.status_transacao = ?, fp.data_pagamento = ? WHERE p.id_pedido = ?`;
    
    // 3. Passa a data de pagamento para a query
    await db.execute(sqlUpdateFormaPagamento, [statusPagamento, dataPagamento, paymentId]);
    console.log(`[pedidoModel] Status do pagamento (forma_pagamento) atualizado para ${statusPagamento} para o pedido ${paymentId}.`);

    // 4. Atualiza a 'pedido' (Query Achatada)
    const sqlUpdatePedido = `UPDATE pedido SET status_pedido = ? WHERE id_pedido = ?`;
    
    const [result] = await db.execute(sqlUpdatePedido, [statusPedido, paymentId]);
    console.log(`[pedidoModel] Status do pedido (pedido) atualizado para ${statusPedido} para o pedido ${paymentId}.`);

    return result.affectedRows;
}


// 3. ATUALIZAR O MODULE.EXPORTS
module.exports = { 
    findByUsuarioId,
    findAllAdmin,
    atualizarStatusPagamento
};