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
                <div className="cart-layout">
                    <CartItems items={cartItems} onEmptyCart={emptyCart} />
                    <CartSummary subtotal={subtotal} />
                </div>
            </div>
        </main>
    );
};

export default CartPage;