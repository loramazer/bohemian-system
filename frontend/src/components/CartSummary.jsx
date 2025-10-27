// loramazer/bohemian-system/bohemian-system-front-back-carrinhos/frontend/src/components/CartSummary.jsx

import React, { useContext } from 'react'; // 1. Removemos useState e apiClient
import { useNavigate } from 'react-router-dom'; // 2. Importamos useNavigate
import { AuthContext } from '../context/AuthContext'; // 3. Importamos o AuthContext
import '../styles/CartSummary.css';

const CartSummary = ({ subtotal, items }) => {
    const total = subtotal;

    // 4. Hooks para navegação e autenticação
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // 5. Removemos os useState de loading e error

    const handleCheckout = () => {

        // --- LÓGICA DE REDIRECIONAMENTO ---
        // 6. Verificamos se o usuário está logado
        if (!user) {
            // Se não estiver logado, redireciona para o login
            // Passamos a rota '/checkout' no state para que a página de login
            // saiba para onde redirecionar o usuário após o sucesso.
            navigate('/login', { state: { from: '/checkout' } });
        } else {
            // Se estiver logado, vai direto para a página de checkout
            navigate('/checkout');
        }
        // 7. Toda a lógica antiga de try/catch e apiClient.post() foi removida daqui.
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

                {/* 8. O <p> de erro foi removido */}

                <button
                    className="checkout-btn"
                    onClick={handleCheckout}
                // 9. Removemos o 'disabled' e o texto de 'loading'
                >
                    Concluir pedido
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