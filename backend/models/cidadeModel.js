const db = require('../config/db');


exports.findOrCreate = async (nome, siglaUF) => {
    let findSql = 'SELECT id_cidade FROM cidade WHERE nome = ? AND sigla_UF = ?';
    let [rows] = await db.execute(findSql, [nome, siglaUF]);

    if (rows.length > 0) {
        return rows[0].id_cidade;
    }

    let createSql = 'INSERT INTO cidade (nome, sigla_UF) VALUES (?, ?)';
    let [result] = await db.execute(createSql, [nome, siglaUF]);

    return result.insertId;
};  