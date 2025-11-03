// frontend/src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../api';
import { AuthContext } from "./AuthContext.jsx";
import { FeedbackContext } from "./FeedbackContext.jsx";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useContext(AuthContext);
    const { showCartSuccess, showToast } = useContext(FeedbackContext);

    const fetchCart = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            return;
        }
        try {
            const response = await apiClient.get('/api/carrinho');
            setCartItems(response.data.itens || []);
        } catch (err) {
            console.error("Erro ao buscar carrinho:", err);
            // --- REFINAMENTO 1: Avisar o usuário se o carrinho falhar ---
            showToast("Não foi possível carregar seu carrinho.");
        }
    }, [user, showToast]); // A dependência [user] está correta

    const ensureCartExists = async () => {
        if (!user) return false;
        try {
            await apiClient.post('/api/carrinho/iniciar');
            return true;
        } catch (error) {
            console.error("Falha ao iniciar ou criar o carrinho:", error);
            return false;
        }
    };

    const addItem = async (produto) => {
        if (!user) {
            // --- REFINAMENTO 2: Substituir o alert() por toast ---
            showToast('Você precisa estar logado para adicionar itens ao carrinho.');
            // (Usando toast.warn para ser informativo, não um erro)
            return;
        }

        const cartReady = await ensureCartExists();
        if (!cartReady) {
            showToast('Falha ao preparar o carrinho. Tente fazer login novamente.');
            return;
        }

        // A sua lógica de preço aqui está perfeita.
        const precoVenda = produto.preco_promocao || produto.preco_venda;
        const precoUnitario = parseFloat(precoVenda);

        if (isNaN(precoUnitario) || precoUnitario <= 0) {
            console.error("Erro: Preço unitário inválido para o produto:", produto);
            showToast('Erro: O produto não tem um preço de venda válido.'); // Trocado alert por toast
            return;
        }

        try {
            const response = await apiClient.post('/api/carrinho/adicionar', {
                produto_id: produto.id_produto,
                quantidade: 1,
                preco_unitario: precoUnitario
            });

            setCartItems(response.data.itens || []);
            showCartSuccess(); // Chama o feedback visual
        } catch (err) {
            console.error("Erro ao adicionar item:", err);
            showToast("Erro ao adicionar item ao carrinho."); // Avisa o usuário da falha
        }
    };

    const esvaziarCarrinho = async () => {
        if (!user) return;
        try {
            await apiClient.delete('/api/carrinho/esvaziar');
            setCartItems([]);
        } catch (error) {
            console.error("Erro ao esvaziar o carrinho:", error);
            showToast("Erro ao esvaziar o carrinho.");
        }
    };

    const removerItemCarrinho = async (itemId) => {
        try {
            await apiClient.delete(`/api/carrinho/item/${itemId}`);
            setCartItems(currentItems =>
                currentItems.filter(item => item.id_item_carrinho !== itemId)
            );
        } catch (error) {
            console.error("Erro ao remover item do carrinho:", error);
            showToast("Erro ao remover item.");
        }
    };

    const atualizarQuantidadeItem = async (itemId, newQuantity) => {
        try {
            await apiClient.put(`/api/carrinho/item/${itemId}`, { quantidade: newQuantity });
            setCartItems(currentItems =>
                currentItems.map(item =>
                    item.id_item_carrinho === itemId
                        ? { ...item, quantidade: newQuantity }
                        : item
                )
            );
        } catch (error) {
            console.error("Erro ao atualizar quantidade do item:", error);
            showToast("Erro ao atualizar quantidade.");
        }
    };

    const value = { cartItems, fetchCart, addItem, esvaziarCarrinho, removerItemCarrinho, atualizarQuantidadeItem };

    useEffect(() => {
        if (user) {
            fetchCart();
        }
        
    }, [user, fetchCart]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};