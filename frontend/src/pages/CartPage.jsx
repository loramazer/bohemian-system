<<<<<<< HEAD
import React, { useState } from 'react';
import CartItems from '../components/CartItems.js';
import CartSummary from '../components/CartSummary.js';


import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';

import '../styles/CartPage.css';

const IMAGES = [img1, img2, img3, img4, img5];

const cartItemsData = [
    { id: 1, name: 'Box com Flores Mistas', price: 219.00, quantity: 1, image: IMAGES[0] },
    { id: 2, name: 'Box com Flores Mistas', price: 219.00, quantity: 1, image: IMAGES[1] },
    { id: 3, name: 'Box com Flores Mistas', price: 219.00, quantity: 1, image: IMAGES[2] },
    { id: 4, name: 'Box com Flores Mistas', price: 219.00, quantity: 1, image: IMAGES[3] },
    { id: 5, name: 'Box com Flores Mistas', price: 219.00, quantity: 1, image: IMAGES[4] },
];

const CartPage = () => {
    const [cartItems, setCartItems] = useState(cartItemsData);

    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    const emptyCart = () => {
=======
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
>>>>>>> origin/front-back-carrinhos
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
<<<<<<< HEAD
                <div className="cart-layout">
                    <CartItems items={cartItems} onEmptyCart={emptyCart} />
                    <CartSummary subtotal={subtotal} />
=======
                {error && <p className="error-message">{error}</p>}
                <div className="cart-layout">
                    <CartItems items={cartItems} onEmptyCart={emptyCart} />
                    <CartSummary subtotal={subtotal} itens = {cartItems}/>
>>>>>>> origin/front-back-carrinhos
                </div>
            </div>
        </main>
    );
};

export default CartPage;