const db = require('../config/db');

exports.findByUserId = async (id_usuario) => {
    const sql = `
        SELECT e.*, c.nome as cidade, c.sigla_UF as estado
        FROM endereco e
        JOIN cidade c ON e.id_cidade = c.id_cidade
        WHERE e.fk_id_usuario = ?
    `;
    const [rows] = await db.execute(sql, [id_usuario]);
    return rows;
};

exports.create = async (id_usuario, dadosEndereco) => {
    const { cep, rua, numero, complemento, bairro, id_cidade } = dadosEndereco;
    const sql = `
        INSERT INTO endereco (fk_id_usuario, cep, rua, numero, complemento, bairro, id_cidade)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [id_usuario, cep, rua, numero, complemento, bairro, id_cidade]);
    return { id: result.insertId, ...dadosEndereco };
};