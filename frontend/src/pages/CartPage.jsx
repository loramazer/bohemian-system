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
<<<<<<< HEAD
        setCartItems([]); // Esta linha precisará ser ajustada para interagir com a API
=======
>>>>>>> origin/front-back-carrinhos
        setCartItems([]);
>>>>>>> a0969b13e006f36122d1440b4e46bd774d973673
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
                {/* Removido o estado de erro local, o erro deve ser tratado no contexto */}
                <div className="cart-layout">
                    <CartItems items={cartItems} onEmptyCart={emptyCart} />
                    <CartSummary subtotal={subtotal} itens={cartItems} />
=======
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
>>>>>>> a0969b13e006f36122d1440b4e46bd774d973673
                </div>
            </div>
        </main>
    );
};

export default CartPage;