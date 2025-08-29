// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../api';

// O valor inicial nulo é seguro porque vamos controlar a renderização dos filhos
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Este useEffect corre apenas uma vez quando a app arranca para verificar o token
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('token');
        if (tokenFromStorage) {
            try {
                const decodedUser = jwtDecode(tokenFromStorage);
                const currentTime = Date.now() / 1000;

                if (decodedUser.exp > currentTime) {
                    // Token é válido
                    setToken(tokenFromStorage);
                    setUser(decodedUser);
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokenFromStorage}`;
                } else {
                    // Token está expirado
                    localStorage.removeItem('token');
                }
            } catch (error) {
                // Token é inválido
                console.error("Token inválido no storage, a removê-lo.", error);
                localStorage.removeItem('token');
            }
        }
        // Em todos os casos, terminámos o carregamento inicial
        setIsLoading(false);
    }, []); // A lista de dependências vazia [] garante que isto corre apenas uma vez

    const login = useCallback((newToken) => {
        localStorage.setItem('token', newToken);
        try {
            const decodedUser = jwtDecode(newToken);
            setToken(newToken);
            setUser(decodedUser);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        } catch (error) {
            console.error("Falha ao processar o novo token no login", error);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete apiClient.defaults.headers.common['Authorization'];
    }, []);

    const value = { user, token, login, logout, isLoading };

    return (
        <AuthContext.Provider value={value}>
            {/* Só renderiza a aplicação quando o carregamento inicial estiver concluído */}
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
