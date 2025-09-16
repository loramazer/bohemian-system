  const db = require('../config/db');

  const clienteModel = {
      // Função para criar um novo cliente
      criarCliente: async (clienteData) => {
          const { nome, email, telefone, fk_id_usuario } = clienteData;
          
          // CORREÇÃO: Adicione a coluna 'email' ao INSERT e use o nome da coluna correto para a FK
          const sql = 'INSERT INTO cliente (nome, email, telefone, fk_usuario_id_usuario) VALUES (?, ?, ?, ?)';
          
          // CORREÇÃO: Passe a variável 'email' nos parâmetros
          const [result] = await db.execute(sql, [nome, email, telefone || null, fk_id_usuario]);
          return result.insertId;
      },

      // Função para encontrar um cliente pelo e-mail
      buscarClientePorEmail: async (email) => {
          const sql = `
              SELECT c.*, u.login as email, u.senha FROM cliente c
              JOIN usuario u ON c.fk_usuario_id_usuario = u.id_usuario 
              WHERE u.login = ?
          `;
          const [rows] = await db.execute(sql, [email]);
          return rows[0];
      },
      
      // Busca os detalhes do perfil do cliente usando o ID do usuário
      findDetailsByUsuarioId: async (usuarioId) => {
          const sql = 'SELECT id_cliente, nome, telefone FROM cliente WHERE fk_usuario_id_usuario = ?';
          const [rows] = await db.execute(sql, [usuarioId]);
          return rows[0];
      }
  };

  // Exporte as funções
  module.exports = {
      criarCliente: clienteModel.criarCliente,
      buscarClientePorEmail: clienteModel.buscarClientePorEmail,
      findDetailsByUsuarioId: clienteModel.findDetailsByUsuarioId
  };