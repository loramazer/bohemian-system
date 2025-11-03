const db = require('../config/db');
const bcrypt = require('bcrypt'); // Importe bcrypt aqui, se for usar no update

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

    // --- NOVO ---
    findById: async (id) => {
        const sql = 'SELECT * FROM usuario WHERE id_usuario = ?';
        try {
            const [rows] = await db.query(sql, [id]);
            return rows[0];
        } catch (error) {
            console.error("Erro ao buscar usuário por ID:", error);
            throw error;
        }
    },
    // --- FIM NOVO ---

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
    },

    // --- NOVO ---
    update: async (id, userData) => {
        // Note que o controller é responsável por criptografar a senha, se ela for alterada
        const { nome, telefone, email, senha } = userData;
        
        const sql = `
            UPDATE usuario 
            SET nome = ?, telefone = ?, login = ?, senha = ?
            WHERE id_usuario = ?
        `;
        
        try {
            await db.query(sql, [nome, telefone, email, senha, id]);
            // Retorna os dados atualizados (sem a senha, que o controller vai remover)
            return { id_usuario: id, nome, telefone, login: email };
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            throw error;
        }
    }
    // --- FIM NOVO ---
};

module.exports = usuarioModel;