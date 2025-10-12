// loramazer/bohemian-system/bohemian-system-front-back-carrinhos/backend/middlewares/authMiddleware.js

const db = require('../config/db');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Verifica se o token foi enviado
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  // 2. Separa o "Bearer" do token
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no formato do token.' });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado.' });
  }

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta');

    // CORREÇÃO: Injeta o ID do perfil (que agora é o ID do cliente/colaborador)
    // Os controllers do carrinho só precisam de cliente_id, que é o que injetamos aqui.
    // Se for admin, este campo será o id_colaborador, mas isso só afeta rotas de admin.
    req.user = { cliente_id: decoded.id }; // <--- CORREÇÃO: Usa 'decoded.id'
    
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};

module.exports = authMiddleware;