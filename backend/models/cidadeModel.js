const db = require('../config/db');

/**
 * Procura uma cidade pelo nome e UF. Se não encontrar, cria uma nova.
 * Retorna o ID da cidade (existente ou recém-criada).
 */
exports.findOrCreate = async (nome, siglaUF) => {
    // 1. Tenta encontrar a cidade
    let findSql = 'SELECT id_cidade FROM cidade WHERE nome = ? AND sigla_UF = ?';
    let [rows] = await db.execute(findSql, [nome, siglaUF]);

    // 2. Se encontrou, retorna o ID
    if (rows.length > 0) {
        return rows[0].id_cidade;
    }

    // 3. Se não encontrou, cria a cidade
    let createSql = 'INSERT INTO cidade (nome, sigla_UF) VALUES (?, ?)';
    let [result] = await db.execute(createSql, [nome, siglaUF]);

    // 4. Retorna o ID da nova cidade
    return result.insertId;
};  