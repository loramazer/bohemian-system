import React from 'react';
import '../../styles/ProductDetails.css';

import { FaHeart, FaShareAlt, FaShoppingCart } from 'react-icons/fa';

const ProductInfo = ({ product }) => {
    return (
        <div className="product-info-section">
            <h1 className="product-title">{product.nome}</h1>
            <div className="product-prices">
                <span className="current-price">{`R$${product.preco_venda}`}</span>
            </div>
            <div className="product-rating">
                {/* Estrelas de avaliação */}
            </div>
            <p className="product-description">{product.descricao}</p>
            <div className="color-options">
                <span>Cores:</span>
                {/* Aqui você pode mapear as cores se tiver no banco */}
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