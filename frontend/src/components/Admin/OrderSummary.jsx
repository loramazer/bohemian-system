// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/components/Admin/OrderSummary.jsx
import React from 'react';
import '../../styles/OrderDetail.css';

const OrderSummary = ({ prices }) => {
    return (
        <div className="order-summary-container">
            <h3>Soma Total</h3>
            <div className="summary-line">
                <span>Subtotal</span>
                <span>R${prices.subtotal.toFixed(2)}</span>
            </div>
            {/* Linha de Taxa Removida */}
            {/* Linha de Desconto Removida */}
            <div className="summary-line">
                <span>Frete</span>
                <span>R${prices.shipping.toFixed(2)}</span>
            </div>
            <div className="summary-line total-line">
                <span>Total</span>
                <span>R${prices.total.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default OrderSummary;