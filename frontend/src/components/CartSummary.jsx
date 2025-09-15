// loramazer/bohemian-system/bohemian-system-front-back-carrinhos/frontend/src/components/CartSummary.jsx

import React, { useState } from 'react';
import apiClient from '../api';
import '../styles/CartSummary.css';

const CartSummary = ({ subtotal, items }) => {
    const total = subtotal;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCheckout = async () => {
        // --- ALTERAÇÃO AQUI ---
        // Se o carrinho estiver vazio, exiba um pop-up de alerta.
        if (!items || items.length === 0) {
            window.alert('Seu carrinho está vazio! Adicione itens antes de continuar.');
            return; // Interrompe a execução da função
        }
        // --------------------

        setLoading(true);
        setError('');

        try {
            const response = await apiClient.post('/carrinho/pagamento/criar-preferencia');
            const { init_point } = response.data;
            window.location.href = init_point;
        } catch (err) {
            console.error('Erro no checkout:', err);
            setError('Não foi possível iniciar o pagamento. Tente novamente.');
            setLoading(false);
        }
    };

    return (
        <div className="cart-summary-container">
            <div className="cart-summary-box">
                <h3 className="summary-title">Soma Total</h3>
                <div className="summary-line">
                    <span>Subtotal</span>
                    <span>R${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-line total-line">
                    <span>Total</span>
                    <span>R${total.toFixed(2)}</span>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={loading} // A validação de carrinho vazio agora é feita no clique
                >
                    {loading ? 'Processando...' : 'Concluir pedido'}
                </button>
            </div>
            <div className="shipping-calculator">
                <h3 className="shipping-title">Calcular Frete</h3>
                <div className="shipping-input-group">
                    <input type="text" placeholder="CEP" className="cep-input" />
                    <button className="calculate-btn">Calcular Frete</button>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;