const db = require('../config/db');

const usuarioModel = {
    /**
     * Busca um usuário pelo e-mail (que agora é o campo 'login').
     * Esta é a ÚNICA função que o login usará para encontrar um usuário.
     * @param {string} email - O e-mail/login do usuário.
     * @returns {Promise<object|null>}
     */
    findByEmail: async (email) => {
        const sql = 'SELECT * FROM usuario WHERE login = ?';
        try {
            const [rows] = await db.query(sql, [email]);
            return rows[0];
        } catch (error) {
            console.error("Erro ao buscar usuário por e-mail:", error);
            throw error;
        }
    },

    /**
     * Cria um novo registro de usuário.
     * @param {object} userData - { email, senha, role }
     * @returns {Promise<number>} O ID do usuário criado.
     */
    create: async (userData) => {
        const { email, senha, role } = userData;
        const sql = 'INSERT INTO usuario (login, senha, role) VALUES (?, ?, ?)';
        try {
            const [result] = await db.query(sql, [email, senha, role]);
            return result.insertId;
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            throw error;
        }
    }
};

module.exports = usuarioModel;