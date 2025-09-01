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

  // 3. Verifica se o token é válido
  try {
    // Substitua 'SEU_SEGREDO_JWT' pela mesma chave que você usa ao criar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta');

    // Adiciona o ID do cliente ao objeto 'req' para ser usado nos controllers
    req.user = { cliente_id: decoded.id }; // Supondo que o ID está no payload do token como 'id'

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};

module.exports = authMiddleware;
