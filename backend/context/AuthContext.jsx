import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Importante para o AdminRoute

    useEffect(() => {
        // Tenta carregar o token do localStorage quando o app inicia
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);

                // Verifica se o token não expirou
                if (decoded.exp * 1000 > Date.now()) {
                    // Define o usuário no estado com as informações do token
                    setUser({
                        id: decoded.id,
                        nome: decoded.nome,
                        email: decoded.email,
                        role: decoded.role // A informação mais importante para o admin
                    });
                } else {
                    // Se o token expirou, remove do localStorage
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error("Token inválido ou corrompido:", error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false); // Finaliza o carregamento inicial
    }, []);

    async function login(req, res) {
        try {
            const { email, senha } = req.body;
            const cliente = await buscarClientePorEmail(email);
            if (!cliente) return res.status(401).json({ message: 'E-mail ou senha inválidos' });

            const senhaValida = await bcrypt.compare(senha, cliente.senha);
            if (!senhaValida) return res.status(401).json({ message: 'E-mail ou senha inválidos' });

            // --- CORREÇÃO AQUI ---
            // Adicione o 'nome' do cliente ao payload do token
            const token = jwt.sign(
                {
                    id: cliente.id_cliente,
                    email: cliente.email,
                    nome: cliente.nome // <-- Adicione esta linha
                },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );
            // ---------------------

            res.json({ message: 'Login realizado com sucesso', token });
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAuthenticated = () => {
        return user !== null;
    };

    // O valor fornecido pelo Provider para todos os componentes filhos
    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};