// loramazer/bohemian-system/bohemian-system-front-back-carrinhos/frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
// Correção: Mude a importação para usar chaves {} e renomeie a função para o padrão camelCase
import { jwtDecode } from 'jwt-decode';
import apiClient from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Correção: Use a função importada corretamente
                const decoded = jwtDecode(token);

                // Verificar se o token não expirou
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({
                        cliente_id: decoded.cliente_id,
                        nome: decoded.nome,
                        email: decoded.email
                        // ... outros dados do usuário que você coloca no token
                    });
                } else {
                    // Token expirado
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error("Token inválido:", error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, senha) => {
        try {
            const response = await apiClient.post('/auth/login', { email, senha });
            const { token } = response.data;
            localStorage.setItem('token', token);

            // Correção: Use a função importada corretamente
            const decoded = jwtDecode(token);
            setUser({
                cliente_id: decoded.cliente_id,
                nome: decoded.nome,
                email: decoded.email
            });
        } catch (error) {
            console.error('Falha no login', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAuthenticated = () => {
        return user !== null;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};