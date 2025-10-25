const authMiddleware = require('./authMiddleware');
const jwt = require('jsonwebtoken'); // Adicione importação

const adminMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // 1. Rejeita se não houver token ou se o formato estiver errado (reutilizando a lógica básica)
    if (!authHeader || authHeader.split(' ').length !== 2 || !/^Bearer$/i.test(authHeader.split(' ')[0])) {
        return res.status(401).json({ error: 'Token não fornecido ou mal formatado.' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        // 2. Verifica e decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta');
        req.user = decoded; 

        // 3. Verifica se o usuário é um administrador (A ÚNICA VERIFICAÇÃO CRÍTICA)
        if (req.user.admin === 1) { // Ou use 'req.user.role === "admin"' dependendo da sua seed
            return next(); 
        } else {
            // 4. Se autenticado, mas não é admin, nega o acesso
            return res.status(403).json({ error: 'Acesso negado: Apenas administradores podem acessar este recurso.' });
        }
    } catch (err) {
        // 5. Token inválido (expirado, modificado, etc.)
        return res.status(401).json({ error: 'Token inválido.' });
    }
};

module.exports = adminMiddleware;