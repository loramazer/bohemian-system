import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItems from '../components/CartItems.jsx';
import CartSummary from '../components/CartSummary.jsx';
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import '../styles/CartPage.css';

const CartPage = () => {
    const { cartItems, esvaziarCarrinho, atualizarQuantidadeItem, removerItemCarrinho } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    console.log("Itens do carrinho na CartPage:", cartItems);

    const subtotal = cartItems.reduce((total, item) => total + (parseFloat(item.preco_unitario) * item.quantidade), 0);
    
    const handleContinuarComprando = () => {
        navigate('/products');
    };

    const handleEsvaziar = () => {
        esvaziarCarrinho();
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
                {cartItems && cartItems.length > 0 ? (
                    <div className="cart-layout">
                        <CartItems items={cartItems} onEmptyCart={esvaziarCarrinho} onUpdateQuantity={atualizarQuantidadeItem}
                            onRemoveItem={removerItemCarrinho} />
                        <CartSummary subtotal={subtotal} itens={cartItems} />
                    </div>
                ) : (
                    <div className="empty-cart-message">
                        <p>Seu carrinho está vazio.</p>
                        <button onClick={handleContinuarComprando} className="continue-shopping-button">
                            Voltar para o Catálogo
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default CartPage;