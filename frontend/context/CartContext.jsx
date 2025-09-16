// src/context/CartContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api';
import { AuthContext } from '../../backend/context/AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useContext(AuthContext);

    const fetchCart = async () => {
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
    };

    const addItem = async (produto) => {
        if (!user) {
            alert('Você precisa estar logado para adicionar itens ao carrinho.');
            return;
        }
        try {
            const response = await apiClient.post('/carrinho/adicionar', {
                produto_id: produto.id_produto,
                quantidade: 1, 
                preco_unitario: produto.preco_venda
            });
            setCartItems(response.data);
            alert('Produto adicionado ao carrinho!'); 
        } catch (err) {
            console.error("Erro ao adicionar item:", err);
            alert('Erro ao adicionar produto ao carrinho. Tente novamente.');
        }
    };

    const value = { cartItems, fetchCart, addItem };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};