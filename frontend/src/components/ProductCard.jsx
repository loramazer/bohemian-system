<<<<<<< HEAD
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
=======
// frontend/src/components/ProductCard.jsx
import React from 'react';
import { FaShoppingCart, FaRegHeart } from 'react-icons/fa';
import '../styles/ProductCard.css';
import placeholderImage from '../assets/5.png'; // Imagem padrão

const ProductCard = ({ product }) => {
    // Se não houver produto, não renderiza nada para evitar erros.
    if (!product) {
        return null;
    }

    // Formata o preço para o padrão brasileiro
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(product.preco);

    return (
        <div className="product-card">
            <div className="product-image-container">
                {/* Usamos a imagem do produto se existir, senão, uma imagem placeholder */}
                <img src={product.imagem_url || placeholderImage} alt={product.nome} />
                <div className="product-actions">
                    <button className="add-to-cart-btn">
                        <FaShoppingCart /> Adicionar ao Carrinho
                    </button>
                    <button className="wishlist-btn">
                        <FaRegHeart />
                    </button>
                </div>
            </div>
            <div className="product-info">
                <h3 className="product-name">{product.nome}</h3>
                <p className="product-price">{formattedPrice}</p>
>>>>>>> origin/front-back-carrinhos
            </div>
        </div>
    );
};

export default ProductCard;