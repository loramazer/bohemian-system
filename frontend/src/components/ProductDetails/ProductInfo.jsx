import React from 'react';
import '../../styles/ProductDetails.css';

import { FaHeart, FaShareAlt, FaShoppingCart } from 'react-icons/fa';

const ProductInfo = ({ product }) => {
    return (
        <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-prices">
                <span className="old-price">{product.oldPrice}</span>
                <span className="current-price">{product.price}</span>
            </div>
            <div className="product-rating">
                {/* Estrelas de avaliação */}
            </div>
            <p className="product-description">{product.description}</p>
            <div className="color-options">
                <span>Cores:</span>
                {product.colors.map((color, index) => (
                    <div key={index} className="color-swatch" style={{ backgroundColor: color }}></div>
                ))}
            </div>
            <div className="product-actions">
                <button className="add-to-cart-btn">
                    <FaShoppingCart /> Carrinho
                </button>
                <button className="add-to-wishlist-btn">
                    <FaHeart />
                </button>
            </div>
            <div className="share-section">
                <span>Compartilhar:</span>
                <FaShareAlt />
            </div>
        </div>
    );
};

export default ProductInfo;