// loramazer/bohemian-system/bohemian-system-front-back-carrinhos/frontend/src/pages/CartPage.jsx

import React, { useEffect, useContext } from 'react'; // useState foi removido por não ser mais necessário aqui
import CartItems from '../components/CartItems.jsx';
import CartSummary from '../components/CartSummary.jsx';
// apiClient não estava sendo usado, pode ser removido se não for usar em 'emptyCart'
// import apiClient from '../api.js'; 
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/CartPage.css';
import { CartContext } from '../../context/CartContext.jsx';

const CartPage = () => {
    // CORREÇÃO: Assumi que seu context também provê o 'error' e uma função para esvaziar o carrinho.
    // Se os nomes forem diferentes, ajuste-os aqui.
    const { cartItems, fetchCart, emptyCart, error } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user, fetchCart]);

    const subtotal = cartItems.reduce((total, item) => total + (parseFloat(item.preco_unitario) * item.quantidade), 0);

    // A função 'emptyCart' agora virá do contexto, então a declaração local não é mais necessária.
    // Se precisar fazer algo a mais antes de chamar a função do contexto, você pode criar uma função de wrapper:
    const handleEmptyCart = () => {
        console.log("Esvaziando o carrinho...");
        // CORREÇÃO: Chame a função 'emptyCart' que vem do seu CartContext.
        // A linha 'setCartItems([])' foi removida pois a função não existe aqui.
        emptyCart();
    };

    // CORREÇÃO 1: Removidas as chaves {} em volta do parêntese do return.
    return (
        <main className="cart-main-content">
            <div className="cart-breadcrumbs">
                <span>Home</span> &gt; <span>Comprar</span> &gt; <span>Carrinho</span>
            </div>
            <div className="cart-content-wrapper">
                <div className="cart-header">
                    <h2 className="page-title">Carrinho</h2>
                </div>
                {/* CORREÇÃO 3: A variável 'error' agora é lida do contexto */}
                {error && <p className="error-message">{error}</p>}

                {/* CORREÇÃO 4: Removida a duplicação do layout do carrinho */}
                <div className="cart-layout">
                    {/* A prop 'onEmptyCart' agora chama a função 'handleEmptyCart' corrigida */}
                    <CartItems items={cartItems} onEmptyCart={handleEmptyCart} />
                    <CartSummary subtotal={subtotal} itens={cartItems} />
                </div>
            </div>
        </main>
    );
};

export default CartPage;