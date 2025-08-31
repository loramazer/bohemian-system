import React, { createContext, useState, useEffect, useCallback } from 'react';
import jwtDecode from 'jwt-decode'; // Correção na importação
import apiClient from '/src/api.js'; // Correção no caminho

export const AuthContext = createContext({
    token: null,
    user: null,
    isLoading: true,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = useCallback((newToken) => {
        localStorage.setItem('token', newToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        const decodedUser = jwtDecode(newToken);
        setUser(decodedUser);
        setToken(newToken);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        delete apiClient.defaults.headers.common['Authorization'];
        setUser(null);
        setToken(null);
    }, []);

    // Este efeito é executado APENAS UMA VEZ quando a aplicação carrega.
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        try {
            if (storedToken) {
                const decodedUser = jwtDecode(storedToken);
                const currentTime = Date.now() / 1000;

                if (decodedUser.exp > currentTime) {
                    // Se o token for válido, configuramos o estado diretamente aqui
                    setToken(storedToken);
                    setUser(decodedUser);
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                } else {
                    // Se o token estiver expirado, limpamos
                    localStorage.removeItem('token');
                }
            }
        } catch (error) {
            // Se o token for inválido, limpamos
            console.error("Falha ao descodificar o token, a removê-lo.", error);
            localStorage.removeItem('token');
        } finally {
            // Após a verificação, o carregamento está concluído
            setIsLoading(false);
        }
    }, []); // A lista de dependências vazia [] garante que isto só acontece uma vez.

    const contextValue = {
        token,
        user,
        login,
        logout,
        isLoading,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

