// src/components/CartSummary.jsx

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/CartSummary.css';

const CartSummary = ({ subtotal, items }) => {
    // Estados
    const [shippingCost, setShippingCost] = useState(null);
    const [cep, setCep] = useState('');
    const [cepError, setCepError] = useState('');
    const [isLoadingCep, setIsLoadingCep] = useState(false); // Para o loading do botão

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const total = subtotal + (shippingCost || 0);

    // Limpa o frete e o erro quando o usuário digita
    const handleCepChange = (e) => {
        setCep(e.target.value);
        setShippingCost(null);
        setCepError('');
    };

    // --- 1. FUNÇÃO ATUALIZADA COM A API ViaCEP ---
    // (Lógica adaptada do seu AddressForm.jsx)
    const handleCalculateShipping = async () => {
        setIsLoadingCep(true);
        setShippingCost(null);
        setCepError('');

        const digitsOnly = cep.replace(/\D/g, ''); // Limpa o CEP

        if (digitsOnly.length !== 8) {
            setCepError('CEP inválido. Por favor, digite 8 números.');
            setIsLoadingCep(false);
            return;
        }

        try {
            // Usando a mesma API ViaCEP do seu AddressForm
            const response = await fetch(`https://viacep.com.br/ws/${digitsOnly}/json/`);
            if (!response.ok) throw new Error('Erro ao buscar CEP.');

            const data = await response.json();

            // Se 'data.erro' for true, o ViaCEP não encontrou o CEP
            if (data.erro) throw new Error('CEP não encontrado.');

            // SUCESSO: O CEP é real. Aplicamos o frete fixo.
            setShippingCost(15.00);

        } catch (error) {
            console.error("Erro ao validar CEP:", error);
            setCepError(error.message || 'CEP inválido ou não encontrado.');
        } finally {
            setIsLoadingCep(false); // Para o loading
        }
    };

    const handleCheckout = () => {
        if (!user) {
            navigate('/login', { state: { from: '/checkout' } });
        } else {
            navigate('/checkout');
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

                {shippingCost !== null && (
                    <div className="summary-line">
                        <span>Frete</span>
                        <span>R${shippingCost.toFixed(2)}</span>
                    </div>
                )}

                <div className="summary-line total-line">
                    <span>Total</span>
                    <span>R${total.toFixed(2)}</span>
                </div>

                <button
                    className="checkout-btn"
                    onClick={handleCheckout}
                >
                    Concluir pedido
                </button>
            </div>
            <div className="shipping-calculator">
                <h3 className="shipping-title">Calcular Frete</h3>

                <div className="shipping-input-group">
                    <input
                        type="text"
                        placeholder="CEP (somente números)"
                        className="cep-input"
                        value={cep}
                        onChange={handleCepChange}
                        maxLength={9}
                    />
                    <button
                        className="calculate-btn"
                        onClick={handleCalculateShipping}
                        disabled={isLoadingCep} // Desabilita enquanto carrega
                    >
                        {isLoadingCep ? 'Validando...' : 'Calcular Frete'}
                    </button>
                </div>

                {cepError && <p className="cep-error">{cepError}</p>}
            </div>
        </div>
    );
};

export default CartSummary;