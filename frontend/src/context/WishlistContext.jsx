// frontend/src/context/WishlistContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../api';
import { AuthContext } from "./AuthContext.jsx";
import { FeedbackContext } from "./FeedbackContext.jsx"; // Para o toast "Adicionado!"

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    // Lista completa de produtos favoritos
    const [wishlistItems, setWishlistItems] = useState([]);
    // Um Set (lista rápida) apenas dos IDs, para verificação rápida (Ex: <FaHeart />)
    const [wishlistIds, setWishlistIds] = useState(new Set());
    
    const { user } = useContext(AuthContext);
    const { showWishlistSuccess } = useContext(FeedbackContext);

    // Função interna para atualizar ambos os estados
    const updateWishlistState = (items) => {
        setWishlistItems(items);
        const ids = new Set(items.map(item => item.id_produto));
        setWishlistIds(ids);
    };

    const fetchWishlist = useCallback(async () => {
        if (!user) {
            updateWishlistState([]); // Limpa a lista se o usuário deslogar
            return;
        }
        try {
            const response = await apiClient.get('/favoritos');
            updateWishlistState(response.data || []);
        } catch (err) {
            console.error("Erro ao buscar favoritos:", err);
            updateWishlistState([]);
        }
    }, [user]);

    // Usado quando o usuário loga
    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addWishlistItem = async (product) => {
        if (!user) return; // Verificação de segurança
        
        try {
            const response = await apiClient.post('/favoritos', { id_produto: product.id_produto });
            updateWishlistState(response.data); // Atualiza o estado com a nova lista
            showWishlistSuccess(); // Mostra o toast "Adicionado à lista de desejos!"
        } catch (err) {
            console.error("Erro ao adicionar favorito:", err);
        }
    };

    const removeWishlistItem = async (id_produto) => {
        if (!user) return;
        
        try {
            const response = await apiClient.delete(`/favoritos/${id_produto}`);
            updateWishlistState(response.data); // Atualiza o estado com a nova lista
            // (Opcional: podemos criar um showWishlistRemoved() no FeedbackContext)
        } catch (err) {
            console.error("Erro ao remover favorito:", err);
        }
    };

    // Função rápida para verificar se um item está favoritado
    const isFavorited = (id_produto) => {
        return wishlistIds.has(id_produto);
    };

    const value = { 
        wishlistItems, 
        fetchWishlist, 
        addWishlistItem, 
        removeWishlistItem, 
        isFavorited 
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};