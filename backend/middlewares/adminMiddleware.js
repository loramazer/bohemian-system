const authMiddleware = require('./authMiddleware');
const jwt = require('jsonwebtoken'); 

const adminMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || authHeader.split(' ').length !== 2 || !/^Bearer$/i.test(authHeader.split(' ')[0])) {
        return res.status(401).json({ error: 'Token não fornecido ou mal formatado.' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta');
        req.user = decoded; 

        if (req.user.admin === 1) { 
            return next(); 
        } else {
            return res.status(403).json({ error: 'Acesso negado: Apenas administradores podem acessar este recurso.' });
        }
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido.' });
    }
};

module.exports = adminMiddleware;