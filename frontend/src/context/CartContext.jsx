// frontend/src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'; // Adicionado useCallback
import apiClient from '../api';
import { AuthContext } from "./AuthContext.jsx";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useContext(AuthContext);

    // Envolve fetchCart em useCallback para evitar problemas no useEffect
    const fetchCart = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            return;
        }
        try {
            const response = await apiClient.get('/carrinho');
            setCartItems(response.data.itens || []);
        } catch (err) {
            console.error("Erro ao buscar carrinho:", err);
        }
    }, [user]);

    const ensureCartExists = async () => {
        if (!user) return false;
        try {
            await apiClient.post('/carrinho/iniciar'); 
            return true;
        } catch (error) {
            console.error("Falha ao iniciar ou criar o carrinho:", error);
            return false;
        }
    };

    const addItem = async (produto) => {
        if (!user) {
            alert('Você precisa estar logado para adicionar itens ao carrinho.');
            return;
        }
        
        // NOVO PASSO: Garante que o carrinho existe antes de adicionar itens
        const cartReady = await ensureCartExists();
        if (!cartReady) {
            alert('Falha ao preparar o carrinho. Tente fazer login novamente.');
            return;
        }

        try {
            const response = await apiClient.post('/carrinho/adicionar', {
                produto_id: produto.id_produto,
                quantidade: 1, 
                // Garante que o preço é um float antes de enviar
                preco_unitario: parseFloat(produto.preco_venda) 
            });
            
            // Atualiza o contexto com a nova lista de itens retornada pelo backend
            setCartItems(response.data.itens || []); 
            // Não é necessário o alert aqui, pois o ProductGrid já gerencia o fluxo de sucesso/erro.
        } catch (err) {
            console.error("Erro ao adicionar item:", err);
            // Removendo o alert duplicado para a interface
            // alert('Erro ao adicionar produto ao carrinho. Tente novamente.'); 
        }
    };
    
    const esvaziarCarrinho = async () => {
        if (!user) return;
        try {
            await apiClient.delete('/carrinho/esvaziar');
            setCartItems([]); // Limpa o estado local
        } catch (error) {
            console.error("Erro ao esvaziar o carrinho:", error);
        }
    };

    const removerItemCarrinho = async (itemId) => {
        try {
                        await apiClient.delete(`/carrinho/item/${itemId}`);

                  setCartItems(currentItems =>
                currentItems.filter(item => item.id_item_carrinho !== itemId)
            );
        } catch (error) {
            console.error("Erro ao remover item do carrinho:", error);
            
        }
    };

    const atualizarQuantidadeItem = async (itemId, newQuantity) => {
        try {
            await apiClient.put(`/carrinho/item/${itemId}`, { quantidade: newQuantity });

            setCartItems(currentItems =>
                currentItems.map(item =>
                    item.id_item_carrinho === itemId
                        ? { ...item, quantidade: newQuantity }
                        : item
                )
            );
        } catch (error) {
            console.error("Erro ao atualizar quantidade do item:", error);
        }
    };

    const value = { cartItems, fetchCart, addItem, esvaziarCarrinho, removerItemCarrinho, atualizarQuantidadeItem };

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user, fetchCart]); // fetchCart agora é estável

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

