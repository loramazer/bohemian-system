// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/backend/controllers/dashboardController.js
const db = require('../config/db');
const pedidoModel = require('../models/pedidoModel');

// Função auxiliar para pegar a primeira imagem do JSON
function parseImageUrl(imageUrlString) {
    if (!imageUrlString) return null;
    try {
        const parsed = JSON.parse(imageUrlString);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0];
        }
    } catch (e) {
        // Ignora o erro se for uma string de URL simples
    }
    // Retorna a string original se não for JSON array ou se falhar
    return imageUrlString.startsWith('http') ? imageUrlString : null;
}

// ... (Funções getKpiData, getBestSellers, getMonthlyRevenue, getRecentOrders permanecem iguais) ...
async function getKpiData(req, res) {
  try {
    const [totalPedidosResult] = await db.execute('SELECT COUNT(*) AS total FROM pedido');
    const [pedidosAtivosResult] = await db.execute('SELECT COUNT(*) AS total FROM pedido WHERE data_entrega >= CURDATE()'); 
    const [pedidosFechadosResult] = await db.execute('SELECT COUNT(*) AS total FROM pedido WHERE data_entrega < CURDATE()');
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
        const query = `
            SELECT 
                p.id_pedido, 
                p.dataPedido, 
                u.nome AS cliente, 
                fp.status_transacao AS status,
                SUM(ip.precoUnitario * ip.quantidade) AS valor_total_pedido,
                GROUP_CONCAT(pr.nome SEPARATOR ', ') AS nome_produtos
            FROM pedido p
            LEFT JOIN usuario u ON p.fk_cliente_id_cliente = u.id_usuario
            LEFT JOIN forma_pagamento fp ON p.fk_forma_pagamento_id_forma_pagamento = fp.id_forma_pagamento
            LEFT JOIN itempedido ip ON p.id_pedido = ip.fk_pedido_id_pedido
            LEFT JOIN produto pr ON ip.fk_produto_id_produto = pr.id_produto
            GROUP BY p.id_pedido, p.dataPedido, u.nome, fp.status_transacao
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
        
        // Query atualizada para buscar todos os campos necessários
        const query = `
            SELECT
                p.id_pedido,
                p.dataPedido,
                p.data_entrega,
                p.status_pedido,                 -- <--- ADICIONADO: Status Logístico
                u.nome AS cliente_nome,
                u.login AS cliente_email,
                u.telefone AS cliente_telefone,
                fp.descricao AS forma_pagamento,
                fp.status_transacao AS status_pagamento, -- <--- Status de Pagamento
                e.nome AS endereco_nome,
                e.numero AS endereco_numero,
                e.complemento AS endereco_complemento,
                e.cep AS endereco_cep,
                cid.nome AS cidade_nome,
                cid.sigla_UF AS cidade_uf,
                ip.quantidade,
                ip.precoUnitario,
                pr.id_produto,
                pr.nome AS nome_produto,
                pr.descricao AS descricao_produto,
                pr.imagem_url AS produto_imagem_url
            FROM pedido p
            LEFT JOIN usuario u ON p.fk_cliente_id_cliente = u.id_usuario
            LEFT JOIN forma_pagamento fp ON p.fk_forma_pagamento_id_forma_pagamento = fp.id_forma_pagamento
            LEFT JOIN endereco e ON p.fk_endereco_id_endereco = e.id_endereco
            LEFT JOIN cidade cid ON e.id_cidade = cid.id_cidade
            LEFT JOIN itempedido ip ON p.id_pedido = ip.fk_pedido_id_pedido
            LEFT JOIN produto pr ON ip.fk_produto_id_produto = pr.id_produto
            WHERE p.id_pedido = ?;
        `;
        const [rows] = await db.execute(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Pedido não encontrado.' });
        }

        const firstRow = rows[0];
        let subtotal = 0;

        const products = rows.map(row => {
            const totalItem = parseFloat(row.precoUnitario) * row.quantidade;
            subtotal += totalItem;
            return {
                id: row.id_produto, 
                name: row.nome_produto,
                idProduto: `#${row.id_produto}`,
                quantity: row.quantidade,
                total: totalItem,
                image: parseImageUrl(row.produto_imagem_url) || 'https://via.placeholder.com/60x60'
            };
        });
        
        const tax = 0.00;
        const discount = 0.00;
        const shipping = firstRow.endereco_nome ? 15.00 : 0.00;
        const total = subtotal + shipping;

        const orderDetails = {
            id: `#${firstRow.id_pedido}`,
            date: new Date(firstRow.dataPedido).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: firstRow.status_pagamento, // Status de Pagamento (usado na tabela AllOrdersPage)
            
            // NOVO: Adicionado status_pedido
            status_pedido: firstRow.status_pedido, // <--- Status Logístico

            client: {
                name: firstRow.cliente_nome,
                email: firstRow.cliente_email,
                phone: firstRow.cliente_telefone || '(Telefone não cadastrado)',
                address: firstRow.endereco_nome,
                city: `${firstRow.cidade_nome}, ${firstRow.cidade_uf}`,
                zip: firstRow.endereco_cep,
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
// --- FIM DA FUNÇÃO ATUALIZADA ---


// ... (Funções getAllPedidosAdmin e updatePedidoStatus permanecem iguais) ...
async function getAllPedidosAdmin(req, res) {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            search,
            startDate,
            endDate
        } = req.query;
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

async function updatePedidoStatus(req, res) {
    try {
        const { id } = req.params; 
        const { status } = req.body; 
        if (!status) {
            return res.status(400).json({ message: 'Status é obrigatório.' });
        }
        const affectedRows = await pedidoModel.updateStatus(id, status);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido não encontrado.' });
        }
        res.status(200).json({ message: 'Status do pedido atualizado com sucesso.' });
    } catch (error) {
        console.error("Erro ao atualizar status do pedido:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
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