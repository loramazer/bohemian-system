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
    req.user = decoded; 
    
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};

module.exports = authMiddleware;