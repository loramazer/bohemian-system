import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CartSummary.css';

const CartSummary = ({ subtotal }) => {
    const total = subtotal;

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
                <div className="tax-info">
                    <input type="checkbox" id="tax-calc" />
                    <label htmlFor="tax-calc">Pode ter impostos calculados ou arredondados</label>
                </div>
                {/* O botão foi substituído por um componente Link */}
                <Link to="/order-confirmed" className="checkout-btn">Checkout</Link>
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