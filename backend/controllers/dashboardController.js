const db = require('../config/db');
const pedidoModel = require('../models/pedidoModel');

function parseImageUrl(imageUrlString) {
    if (!imageUrlString) return null;
    try {
        const parsed = JSON.parse(imageUrlString);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0];
        }
    } catch (e) {

    }

    return imageUrlString;
}

async function getKpiData(req, res) {
    try {
        const [totalPedidosResult] = await db.execute('SELECT COUNT(*) AS total FROM pedido');

        const [pedidosAtivosResult] = await db.execute(
            `SELECT COUNT(p.id_pedido) AS total FROM pedido p JOIN forma_pagamento fp ON p.fk_forma_pagamento_id_forma_pagamento = fp.id_forma_pagamento WHERE fp.status_transacao = 'approved' AND p.status_pedido != 'delivered'`
        );

        const [pedidosFechadosResult] = await db.execute(
            `SELECT COUNT(*) AS total FROM pedido WHERE status_pedido = 'delivered'`
        );

        const [pedidosPrevistosResult] = await db.execute(
            `SELECT COUNT(p.id_pedido) AS total FROM pedido p JOIN forma_pagamento fp ON p.fk_forma_pagamento_id_forma_pagamento = fp.id_forma_pagamento WHERE fp.status_transacao = 'pending'`
        );

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
        const query = `SELECT pr.nome, SUM(ip.quantidade) AS total_vendido FROM itempedido ip JOIN produto pr ON ip.fk_produto_id_produto = pr.id_produto GROUP BY pr.nome ORDER BY total_vendido DESC LIMIT 4;`;
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
            query = `SELECT DATE_FORMAT(p.dataPedido, '%Y-%m') AS mes, SUM(i.precoUnitario * i.quantidade) AS total_faturado FROM pedido p JOIN itempedido i ON p.id_pedido = i.fk_pedido_id_pedido WHERE p.dataPedido >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) GROUP BY mes ORDER BY mes ASC;`;
        } else if (period === 'annual') {
            query = `SELECT DATE_FORMAT(p.dataPedido, '%Y-%m') AS mes, SUM(i.precoUnitario * i.quantidade) AS total_faturado FROM pedido p JOIN itempedido i ON p.id_pedido = i.fk_pedido_id_pedido WHERE p.dataPedido >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) GROUP BY mes ORDER BY mes ASC;`;
        } else {
            query = `SELECT DATE_FORMAT(p.dataPedido, '%Y-%m') AS mes, SUM(i.precoUnitario * i.quantidade) AS total_faturado FROM pedido p JOIN itempedido i ON p.id_pedido = i.fk_pedido_id_pedido WHERE p.dataPedido >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) GROUP BY mes ORDER BY mes ASC;`;
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
        const FRETE_FIXO = 15.00;

        const query = `SELECT p.id_pedido, p.dataPedido, u.nome AS cliente, p.status_pedido AS status_pedido, (SUM(ip.precoUnitario * ip.quantidade) + ?) AS valor_total_com_frete, SUM(ip.precoUnitario * ip.quantidade) AS valor_subtotal, GROUP_CONCAT(pr.nome SEPARATOR ', ') AS nome_produtos FROM pedido p LEFT JOIN usuario u ON p.fk_id_usuario = u.id_usuario LEFT JOIN forma_pagamento fp ON p.fk_forma_pagamento_id_forma_pagamento = fp.id_forma_pagamento LEFT JOIN itempedido ip ON p.id_pedido = ip.fk_pedido_id_pedido LEFT JOIN produto pr ON ip.fk_produto_id_produto = pr.id_produto GROUP BY p.id_pedido, p.dataPedido, u.nome, p.status_pedido ORDER BY p.dataPedido DESC LIMIT 6;`;

        const [rows] = await db.execute(query, [FRETE_FIXO]);

        const formattedRows = rows.map(order => ({
            id_pedido: order.id_pedido,
            dataPedido: order.dataPedido,
            cliente: order.cliente,
            status: order.status_pedido,
            valor_total_pedido: parseFloat(order.valor_total_com_frete).toFixed(2),
            nome_produtos: order.nome_produtos
        }));

        res.json(formattedRows);
    } catch (error) {
        console.error('Erro ao buscar pedidos recentes:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

async function getOrderDetails(req, res) {
    try {
        const { id } = req.params;

        const query = `SELECT p.id_pedido, p.dataPedido, p.data_entrega, p.status_pedido, u.nome AS cliente_nome, u.login AS cliente_email, u.telefone AS cliente_telefone, fp.descricao AS forma_pagamento, fp.status_transacao AS status_pagamento, e.nome AS endereco_nome, e.numero AS endereco_numero, e.complemento AS endereco_complemento, e.cep AS endereco_cep, cid.nome AS cidade_nome, cid.sigla_UF AS cidade_uf, ip.quantidade, ip.precoUnitario, pr.id_produto, pr.nome AS nome_produto, pr.descricao AS descricao_produto, pr.imagem_url AS produto_imagem_url FROM pedido p LEFT JOIN usuario u ON p.fk_id_usuario = u.id_usuario LEFT JOIN forma_pagamento fp ON p.fk_forma_pagamento_id_forma_pagamento = fp.id_forma_pagamento LEFT JOIN endereco e ON p.fk_endereco_id_endereco = e.id_endereco LEFT JOIN cidade cid ON e.id_cidade = cid.id_cidade LEFT JOIN itempedido ip ON p.id_pedido = ip.fk_pedido_id_pedido LEFT JOIN produto pr ON ip.fk_produto_id_produto = pr.id_produto WHERE p.id_pedido = ?;`;

        const [rows] = await db.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Pedido não encontrado.' });
        }

        const firstRow = rows[0];
        let subtotal = 0;

        const products = rows.map(row => {
            if (!row.id_produto) return null;

            const totalItem = parseFloat(row.precoUnitario) * row.quantidade;
            subtotal += totalItem;
            return {
                id: row.id_produto,
                name: row.nome_produto,
                idProduto: `#${row.id_produto}`,
                quantity: row.quantidade,
                total: totalItem,
                image: parseImageUrl(row.produto_imagem_url) || 'https://placeholder.co/60x60'
            };
        }).filter(p => p !== null);

        const tax = 0.00;
        const discount = 0.00;
        const shipping = firstRow.endereco_nome ? 15.00 : 0.00;
        const total = subtotal + shipping;

        const orderDetails = {
            id: `#${firstRow.id_pedido}`,
            date: new Date(firstRow.dataPedido).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: firstRow.status_pagamento,
            status_pedido: firstRow.status_pedido,

            client: {
                name: firstRow.cliente_nome,
                email: firstRow.cliente_email,
                phone: firstRow.cliente_telefone || '(Telefone não cadastrado)',
                address: firstRow.endereco_nome ? `${firstRow.endereco_nome}, ${firstRow.endereco_numero}` : 'Retirada na Loja',
                city: firstRow.cidade_nome ? `${firstRow.cidade_nome}, ${firstRow.cidade_uf}` : '',
                zip: firstRow.endereco_cep || '',
            },

            paymentInfo: {
                method: firstRow.forma_pagamento,
                name: firstRow.cliente_nome,
                phone: firstRow.cliente_telefone || '(N/A)',
            },

            shippingInfo: {
                method: 'Next express',
                status: firstRow.status_pagamento,
                payment: firstRow.forma_pagamento,
            },

            products: products,

            prices: {
                subtotal: subtotal,
                tax: tax,
                discount: discount,
                shipping: shipping,
                total: total,
            }
        };

        res.json(orderDetails);

    } catch (error) {
        console.error("Erro ao buscar detalhes do pedido:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
}

async function getAllPedidosAdmin(req, res) {
    try {
        const { page = 1, limit = 10, status, search, startDate, endDate } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            status: status || null,
            search: search || null,
            startDate: startDate || null,
            endDate: endDate || null,
        };
        const result = await pedidoModel.findAllAdmin(options);
        res.status(200).json(result);
    } catch (error) {
        console.error("Erro ao buscar todos os pedidos (Admin):", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
}

const normalizeStatus = (status) => {
    if (!status) return '';
    const s = status.toLowerCase();
    const map = {
        'pendente': 'pending',
        'em preparação': 'in_process',
        'enviado': 'authorized',
        'entregue': 'delivered',
        'cancelado': 'cancelled',
        'rejeitado': 'rejected'
    };
    return map[s] || s;
};

async function updatePedidoStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    const statusHierarchy = {
        'pending': 1,
        'in_process': 2,
        'authorized': 3,
        'delivered': 4,
        'cancelled': 99,
        'rejected': 99
    };

    const statusToDbMap = {
        'pending': 'Pendente',
        'in_process': 'Em Preparação',
        'authorized': 'Enviado',
        'delivered': 'Entregue',
        'cancelled': 'Cancelado',
        'rejected': 'Rejeitado'
    };

    try {
        const [rows] = await db.execute('SELECT status_pedido FROM pedido WHERE id_pedido = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Pedido não encontrado no sistema." });
        }

        const currentStatusDb = rows[0].status_pedido;

        const currentCode = normalizeStatus(currentStatusDb);
        const newCode = normalizeStatus(status);

        const currentRank = statusHierarchy[currentCode] || 0;
        const newRank = statusHierarchy[newCode] || 0;

        if (currentCode === 'delivered' || currentCode === 'cancelled' || currentCode === 'rejected') {
            return res.status(400).json({
                message: `Ação bloqueada: O pedido já foi finalizado como '${currentStatusDb}' e não aceita mais alterações.`
            });
        }

        const isCancelling = (newCode === 'cancelled' || newCode === 'rejected');

        if (!isCancelling && newRank <= currentRank) {
            const newStatusName = statusToDbMap[newCode] || status;
            return res.status(400).json({
                message: `Fluxo inválido: Não é permitido voltar de '${currentStatusDb}' para '${newStatusName}'. O status deve seguir a ordem cronológica.`
            });
        }

        const statusParaSalvar = statusToDbMap[newCode] || status;

        await db.execute('UPDATE pedido SET status_pedido = ? WHERE id_pedido = ?', [statusParaSalvar, id]);

        res.status(200).json({ message: "Status atualizado com sucesso.", novoStatus: statusParaSalvar });

    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        res.status(500).json({ message: "Erro interno ao atualizar status." });
    }
}

module.exports = {
    getKpiData,
    getBestSellers,
    getMonthlyRevenue,
    getRecentOrders,
    getOrderDetails,
    getAllPedidosAdmin,
    updatePedidoStatus
};