const db = require('../config/db');

exports.findByUserId = async (id_usuario) => {

    const sql = `
        SELECT 
            e.id_endereco, 
            e.numero, 
            e.complemento, 
            e.id_cidade, 
            e.cep,
            e.nome as rua,  /* <-- ALIAS (TRADUÇÃO) */
            NULL as bairro, /* <-- CAMPO FICTÍCIO */
            c.nome as cidade, 
            c.sigla_UF as estado
        FROM endereco e
        JOIN cidade c ON e.id_cidade = c.id_cidade
        WHERE e.fk_id_usuario = ?
    `;
    const [rows] = await db.execute(sql, [id_usuario]);
    return rows;
};

exports.create = async (id_usuario, dadosEndereco) => {
    const { cep, rua, numero, complemento, bairro, id_cidade } = dadosEndereco;
   
    const nomeRuaCompleto = bairro ? `${rua} - ${bairro}` : rua;

    const sqlInsert = `
        INSERT INTO endereco (fk_id_usuario, cep, nome, numero, complemento, id_cidade)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sqlInsert, [id_usuario, cep, nomeRuaCompleto, numero, complemento, id_cidade]);
    
    return { 
        id: result.insertId, 
        cep, 
        rua: nomeRuaCompleto, 
        bairro: null, 
        numero, 
        complemento, 
        id_cidade 
    };
};


exports.remove = async (id_endereco, id_usuario) => {
    const sql = 'DELETE FROM endereco WHERE id_endereco = ? AND fk_id_usuario = ?';
    const [result] = await db.execute(sql, [id_endereco, id_usuario]);
    return result.affectedRows; // Retorna 1 se deletou, 0 se não
};