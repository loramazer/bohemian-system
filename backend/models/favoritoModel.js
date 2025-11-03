const db = require('../config/db');

exports.findByUserId = async (id_usuario) => {
    const sql = `
        SELECT 
            p.id_produto, 
            p.nome, 
            p.preco_venda, 
            -- p.preco_promocao, <-- ESTA COLUNA NÃO EXISTE E CAUSA O ERRO 500
            p.imagem_url 
        FROM produto p
        INNER JOIN favoritos f ON p.id_produto = f.id_produto
        WHERE f.id_usuario = ?
    `;
    const [rows] = await db.execute(sql, [id_usuario]);
    return rows;
};


exports.add = async (id_usuario, id_produto) => {
    const sql = 'INSERT IGNORE INTO favoritos (id_usuario, id_produto) VALUES (?, ?)';
    const [result] = await db.execute(sql, [id_usuario, id_produto]);
    return result;
};


exports.remove = async (id_usuario, id_produto) => {
    const sql = 'DELETE FROM favoritos WHERE id_usuario = ? AND id_produto = ?';
    await db.execute(sql, [id_usuario, id_produto]);
};