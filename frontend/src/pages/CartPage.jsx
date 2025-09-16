// loramazer/bohemian-system/bohemian-system-front-back-carrinhos/frontend/src/pages/CartPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import CartItems from '../components/CartItems.jsx';
import CartSummary from '../components/CartSummary.jsx';
import apiClient from '../api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/CartPage.css';

// Importe o novo contexto de carrinho
import { CartContext } from '../context/CartContext.jsx';

const CartPage = () => {
    // Agora o estado do carrinho é gerenciado pelo CartContext
    const { cartItems, fetchCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        // A função fetchCart é chamada aqui, mas agora ela vem do contexto
        if (user) {
            fetchCart();
        }
    }, [user, fetchCart]); // Adicione fetchCart como dependência para que o useEffect seja re-executado quando a função for alterada.

    const subtotal = cartItems.reduce((total, item) => total + (parseFloat(item.preco_unitario) * item.quantidade), 0);

    // Futuramente, esta função fará uma chamada à API para esvaziar o carrinho
    const emptyCart = () => {
        console.log("Esvaziando o carrinho...");
        setCartItems([]); // Esta linha precisará ser ajustada para interagir com a API
    };

    return (
        <main className="cart-main-content">
            <div className="cart-breadcrumbs">
                <span>Home</span> &gt; <span>Comprar</span> &gt; <span>Carrinho</span>
            </div>
            <div className="cart-content-wrapper">
                <div className="cart-header">
                    <h2 className="page-title">Carrinho</h2>
                </div>
                {/* Removido o estado de erro local, o erro deve ser tratado no contexto */}
                <div className="cart-layout">
                    <CartItems items={cartItems} onEmptyCart={emptyCart} />
                    <CartSummary subtotal={subtotal} itens={cartItems} />
                </div>
            </div>
        </main>
    );
};

export default CartPage;