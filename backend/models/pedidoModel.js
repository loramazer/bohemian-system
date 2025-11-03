// backend/models/pedidoModel.js
const db = require('../config/db');

async function findByUsuarioId(usuarioId) {
    // ESTA É A CONSULTA CORRIGIDA
    const query = `
        SELECT 
            p.id_pedido,
            p.dataPedido,
            p.data_entrega,
            fp.status_transacao AS status,
            
            p.status_pedido, -- <-- ADICIONADO: Busca o status logístico do pedido

            -- CORREÇÃO: Trocado 'e.rua' por 'e.nome' (como no seu dump)
            e.nome AS rua, 
            e.numero,
            e.complemento,
            cid.nome AS cidade,
            cid.sigla_UF AS estado,
            
            -- Calcula o total do pedido somando (preco * quantidade) de cada item
            (SELECT SUM(ip_inner.precoUnitario * ip_inner.quantidade)
             FROM itempedido ip_inner
             WHERE ip_inner.fk_pedido_id_pedido = p.id_pedido) AS total_pedido,
             
            -- Agrupa todos os itens do pedido em um array JSON
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id_produto', pr.id_produto,
                    'nome_produto', pr.nome,
                    'quantidade', ip.quantidade,
                    'precoUnitario', ip.precoUnitario,
                    'imagem_url', pr.imagem_url 
                )
            ) AS itens

        FROM pedido p
        JOIN itempedido ip ON p.id_pedido = ip.fk_pedido_id_pedido
        JOIN produto pr ON ip.fk_produto_id_produto = pr.id_produto
        JOIN forma_pagamento fp ON p.fk_forma_pagamento_id_forma_pagamento = fp.id_forma_pagamento
        JOIN endereco e ON p.fk_endereco_id_endereco = e.id_endereco
        JOIN cidade cid ON e.id_cidade = cid.id_cidade

        -- O ID do cliente está na tabela 'pedido'
        WHERE p.fk_cliente_id_cliente = ? 

        -- CORREÇÃO: Agrupando pelos campos corretos
        GROUP BY p.id_pedido, p.dataPedido, p.data_entrega, fp.status_transacao, 
                 e.nome, e.numero, e.complemento, cid.nome, cid.sigla_UF,
                 p.status_pedido -- <-- ADICIONADO: Agrupa pelo novo campo
                 
        ORDER BY p.dataPedido DESC;
    `;

    try {
        const [rows] = await db.execute(query, [usuarioId]);
        
        return rows.map(order => ({
            ...order,
            itens: order.itens.map(item => ({
                ...item,
                imagem_url: parseImageUrl(item.imagem_url)
            }))
        }));

    } catch (error) {
        console.error("Erro ao buscar pedidos por usuário no Model:", error);
        throw error;
    }
}

// Função auxiliar para pegar a primeira imagem do JSON
function parseImageUrl(imageUrlString) {
    try {
        const parsed = JSON.parse(imageUrlString);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0];
        }
    } catch (e) {
        // Ignora o erro
    }
    return imageUrlString; 
}

// --- FUNÇÃO ATUALIZADA: findAllAdmin (Inclui status_pedido) ---
async function findAllAdmin(options) {
    const {
        page = 1,
        limit = 10,
        status,
        search, // Para buscar nome do cliente
        startDate,
        endDate
    } = options;
    
    // NOVO: Definir Frete Fixo
    const FRETE_FIXO = 15.00;

    let params = [];
    let countParams = [];
    let whereClauses = [];

    // CORREÇÃO: Trocado 'cliente c' por 'usuario u'
    let baseSql = `
        FROM pedido p
        JOIN usuario u ON p.fk_cliente_id_cliente = u.id_usuario
        JOIN forma_pagamento fp ON p.fk_forma_pagamento_id_forma_pagamento = fp.id_forma_pagamento
        LEFT JOIN itempedido ip ON p.id_pedido = ip.fk_pedido_id_pedido
    `;

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
    let sql = `
        SELECT 
            p.id_pedido,
            p.dataPedido,
            u.nome AS cliente_nome,
            fp.status_transacao AS status,
            p.status_pedido AS status_pedido, 
            -- CORREÇÃO CRÍTICA: Adicionando o frete de R$ 15,00
            (SELECT SUM(ip_inner.precoUnitario * ip_inner.quantidade)
             FROM itempedido ip_inner
             WHERE ip_inner.fk_pedido_id_pedido = p.id_pedido) + ${FRETE_FIXO} AS total_pedido
        ${baseSql}
        ${whereSql}
        GROUP BY p.id_pedido, p.dataPedido, u.nome, fp.status_transacao, p.status_pedido
        ORDER BY p.dataPedido DESC
    `;

    const offset = (page - 1) * limit;
    sql += ` LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    const [pedidos] = await db.execute(sql, params);

    return {
        // Mapeia para garantir que total_pedido seja string com 2 casas decimais
        pedidos: pedidos.map(p => ({
            ...p,
            total_pedido: p.total_pedido ? parseFloat(p.total_pedido).toFixed(2) : '0.00'
        })),
        totalPages,
        totalPedidos,
        currentPage: parseInt(page)
    };
}

// --- FUNÇÃO RENOMEADA: updatePaymentStatus (Atualiza Status de Pagamento) ---
async function updatePaymentStatus(pedidoId, status) {
    const sql = `
        UPDATE forma_pagamento fp
        JOIN pedido p ON fp.id_forma_pagamento = p.fk_forma_pagamento_id_forma_pagamento
        SET fp.status_transacao = ?
        WHERE p.id_pedido = ?
    `;
    const [result] = await db.execute(sql, [status, pedidoId]);
    return result.affectedRows;
}

// --- FUNÇÃO NOVA: updateOrderStatus (Atualiza Status Logístico) ---
async function updateOrderStatus(pedidoId, statusPedido) {
    const sql = `
        UPDATE pedido
        SET status_pedido = ?
        WHERE id_pedido = ?
    `;
    const [result] = await db.execute(sql, [statusPedido, pedidoId]);
    return result.affectedRows;
}


// 3. ATUALIZAR O MODULE.EXPORTS
module.exports = { 
    findByUsuarioId,
    findAllAdmin, // <-- ADICIONADO
    updatePaymentStatus, // <-- RENOMEADO
    updateOrderStatus  // <-- NOVO
};