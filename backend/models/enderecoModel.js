const db = require('../config/db');

/**
 * AGORA FUNCIONA: Busca TODOS os endereços associados ao fk_id_usuario.
 */
exports.findByUserId = async (id_usuario) => {
    // A coluna 'fk_id_usuario' agora existe na tabela 'endereco'.
    // Continuamos "traduzindo" e.nome (DB) para rua (Frontend).
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
    // Retorna a lista de endereços (pode ter 0, 1 ou muitos)
    return rows;
};

/**
 * AGORA FUNCIONA: Cria um novo endereço já com o fk_id_usuario.
 */
exports.create = async (id_usuario, dadosEndereco) => {
    // O frontend envia 'rua' e 'bairro'
    const { cep, rua, numero, complemento, bairro, id_cidade } = dadosEndereco;
    
    // Combinamos 'rua' e 'bairro' no campo 'nome' do DB
    const nomeRuaCompleto = bairro ? `${rua} - ${bairro}` : rua;

    // 1. Insere o novo endereço na tabela 'endereco' com o 'fk_id_usuario'
    const sqlInsert = `
        INSERT INTO endereco (fk_id_usuario, cep, nome, numero, complemento, id_cidade)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sqlInsert, [id_usuario, cep, nomeRuaCompleto, numero, complemento, id_cidade]);
    
    // Retorna o novo endereço criado (no formato que o frontend espera)
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

/**
 * AGORA FUNCIONA: Deleta fisicamente o endereço do banco.
 */
exports.remove = async (id_endereco, id_usuario) => {
    // Deleta o endereço SE ele pertencer ao usuário (fk_id_usuario)
    const sql = 'DELETE FROM endereco WHERE id_endereco = ? AND fk_id_usuario = ?';
    const [result] = await db.execute(sql, [id_endereco, id_usuario]);
    return result.affectedRows; // Retorna 1 se deletou, 0 se não
};