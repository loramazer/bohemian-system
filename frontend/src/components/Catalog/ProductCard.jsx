import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ProductCard.css';

const ProductCard = ({ imageSrc, name, code, price, oldPrice, tag }) => {
    return (
        <div className="product-card">
            {tag && <span className="product-tag">{tag}</span>}
            <div className="product-image-container">
                <img src={imageSrc} alt={name} className="product-image" />
            </div>
            <div className="product-info">
                <h3 className="product-name">{name}</h3>
                <p className="product-code">{code}</p>
                <div className="product-prices">
                    {oldPrice && <span className="old-price">{oldPrice}</span>}
                    <span className="current-price">{price}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;