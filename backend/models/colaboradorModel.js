// loramazer/bohemian-system/bohemian-system-front-back-carrinhos/backend/models/colaboradorModel.js
const db = require('../config/db');

const colaboradorModel = {
    /**
     * Busca os detalhes de um colaborador usando o ID do usuário.
     * @param {number} usuarioId - A chave estrangeira (fk_id_usuario).
     * @returns {Promise<object|null>}
     */
    findDetailsByUsuarioId: async (usuarioId) => {
        const sql = 'SELECT id_colaborador, nome FROM colaborador WHERE fk_id_usuario = ?';
        try {
            const [rows] = await db.execute(sql, [usuarioId]);
            return rows[0];
        } catch (error) {
            console.error("Erro ao buscar detalhes do colaborador:", error);
            throw error;
        }
    },
    // Você pode adicionar uma função 'create' aqui se precisar criar colaboradores programaticamente
};

module.exports = colaboradorModel;