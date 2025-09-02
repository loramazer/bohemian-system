// loramazer/bohemian-system/bohemian-system-front-back-carrinhos/frontend/src/pages/CartPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import CartItems from '../components/CartItems.jsx';
import CartSummary from '../components/CartSummary.jsx';
import apiClient from '../api.js'; // Nosso conector da API
import { AuthContext } from '../context/AuthContext.jsx'; // Para saber se o usuário está logado
import '../styles/CartPage.css';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext); // Pega o usuário do contexto

    useEffect(() => {
        // A função só deve buscar o carrinho se o usuário estiver logado
        if (user) {
            const fetchCart = async () => {
                try {
                    // Usa o endpoint "verCarrinho" do seu controller
                    const response = await apiClient.get('/carrinho');
                    // A API retorna um objeto { carrinho, itens }
                    setCartItems(response.data.itens || []);
                } catch (err) {
                    console.error("Erro ao buscar carrinho:", err);
                    setError("Não foi possível carregar os itens do carrinho.");
                }
            };

            fetchCart();
        }
    }, [user]); // O useEffect será executado sempre que o 'user' mudar

    // A lógica do subtotal precisa usar os nomes dos campos que vêm do backend
    const subtotal = cartItems.reduce((total, item) => total + (parseFloat(item.preco_unitario) * item.quantidade), 0);

    // Futuramente, esta função fará uma chamada à API para esvaziar o carrinho
    const emptyCart = () => {
        console.log("Esvaziando o carrinho...");
        setCartItems([]);
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
                {error && <p className="error-message">{error}</p>}
                <div className="cart-layout">
                    <CartItems items={cartItems} onEmptyCart={emptyCart} />
                    <CartSummary subtotal={subtotal} itens = {cartItems}/>
                </div>
            </div>
        </main>
    );
};

export default CartPage;