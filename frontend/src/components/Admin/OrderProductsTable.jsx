import React from 'react';
import '../../styles/OrderDetail.css';

const OrderProductsTable = ({ products }) => {
    return (
        <div className="order-products-table-container">
            <h3>Produtos</h3>
            <div className="order-products-table-header">
                <span className="product-checkbox"></span>
                <span>Produto</span>
                <span>Id Produto</span>
                <span>Quantidade</span>
                <span>Total</span>
            </div>
            {products.map(product => (
                <div key={product.id} className="order-product-row">
                    <input type="checkbox" />
                    <div className="product-info-row">
                        <img src={product.image} alt={product.name} />
                        <span>{product.name}</span>
                    </div>
                    <span>{product.idProduto}</span>
                    <span>{product.quantity}</span>
                    <span>R${product.total.toFixed(2)}</span>
                </div>
            ))}
        </div>
    );
};

export default OrderProductsTable;