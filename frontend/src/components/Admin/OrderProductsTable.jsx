// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/components/Admin/OrderProductsTable.jsx
import React from 'react';
import '../../styles/OrderDetail.css';

const OrderProductsTable = ({ products }) => {
    return (
        <div className="order-products-table-container">
            <h3>Produtos</h3>
            <div className="order-products-table-header">
                <span>Produto</span>
                <span>Quantidade</span>
                <span>Total</span>
            </div>
            {products.map(product => (
                <div key={product.id} className="order-product-row">
                    <div className="product-info-row">
                        <img src={product.image} alt={product.name} />
                        <span>{product.name}</span>
                    </div>
                    <span>{product.quantity}</span>
                    <span>R${product.total.toFixed(2)}</span>
                </div>
            ))}
        </div>
    );
};

export default OrderProductsTable;