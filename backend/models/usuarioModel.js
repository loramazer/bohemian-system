const db = require('../config/db');

const usuarioModel = {
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

    create: async (userData) => {
        const { nome, telefone, email, senha, admin } = userData;
        const sql = 'INSERT INTO usuario (nome, telefone, login, senha, admin) VALUES (?, ?, ?, ?, ?)';
        try {
            const [result] = await db.query(sql, [nome, telefone, email, senha, admin]);
            return result.insertId;
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            throw error;
        }
    }
};

module.exports = usuarioModel;