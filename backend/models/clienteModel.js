const db = require('../config/db');

const clienteModel = {
    // Função para criar um novo cliente
    criarCliente: async (clienteData) => {
        const { nome, telefone, fk_id_usuario } = clienteData;
        const sql = 'INSERT INTO cliente (nome, telefone, fk_id_usuario) VALUES (?, ?, ?)';
        const [result] = await db.execute(sql, [nome, telefone || null, fk_id_usuario]);
        return result.insertId;
    },

    // Função para encontrar um cliente pelo e-mail (usada no registro e recuperação de senha)
    buscarClientePorEmail: async (email) => {
        // Esta query precisa ser ajustada para o novo modelo de banco de dados
        const sql = `
            SELECT c.*, u.login as email, u.senha FROM cliente c
            JOIN usuario u ON c.fk_id_usuario = u.id_usuario
            WHERE u.login = ?
        `;
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    },
    
    // --- FUNÇÃO CORRIGIDA/ADICIONADA ---
    // Busca os detalhes do perfil do cliente usando o ID do usuário
    findDetailsByUsuarioId: async (usuarioId) => {
        const sql = 'SELECT id_cliente, nome, telefone FROM cliente WHERE fk_id_usuario = ?';
        const [rows] = await db.execute(sql, [usuarioId]);
        return rows[0];
    }
};

// --- CORREÇÃO NO EXPORT ---
// Exporte a nova função junto com as outras
module.exports = {
    criarCliente: clienteModel.criarCliente,
    buscarClientePorEmail: clienteModel.buscarClientePorEmail,
    findDetailsByUsuarioId: clienteModel.findDetailsByUsuarioId // <-- Adicione esta linha
};