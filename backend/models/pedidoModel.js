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
            
            -- CORREÇÃO: Trocado 'e.rua' por 'e.nome' e 'e.bairro' foi removido
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

        -- Assumindo que 'fk_cliente_id_cliente' na tabela 'pedido' 
        -- é a chave estrangeira para 'usuario.id_usuario'
        WHERE p.fk_cliente_id_cliente = ? 

        -- CORREÇÃO: Removido 'e.bairro' e 'e.rua' do GROUP BY
        GROUP BY p.id_pedido, p.dataPedido, p.data_entrega, fp.status_transacao, 
                 e.nome, e.numero, e.complemento, cid.nome, cid.sigla_UF
                 
        ORDER BY p.dataPedido DESC;
    `;

    try {
        const [rows] = await db.execute(query, [usuarioId]);
        
        // O MySQL pode retornar strings JSON para imagem_url. Vamos parseá-las.
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
        // Tenta parsear, caso a URL esteja salva como um array JSON (ex: '["url1.jpg", "url2.jpg"]')
        const parsed = JSON.parse(imageUrlString);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0]; // Retorna a primeira imagem
        }
    } catch (e) {
        // Se não for um JSON (ou seja, já é uma URL de texto simples), ignora o erro
    }
    // Retorna a string original (seja ela a URL única ou o JSON que falhou no parse)
    return imageUrlString; 
}

module.exports = { findByUsuarioId };