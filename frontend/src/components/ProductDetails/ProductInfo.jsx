import React, { useContext } from 'react';
import '../../styles/ProductDetails.css';
import { FaHeart, FaShareAlt, FaShoppingCart } from 'react-icons/fa';
// Importe o CartContext para acessar a função addItem
import { CartContext } from '../../../context/CartContext';
import { Link } from 'react-router-dom'; 

const ProductInfo = ({ product }) => {
    // Acesse a função addItem do CartContext
    const { addItem } = useContext(CartContext);

    // Agora, esta função chamará a lógica real para adicionar o item
    const handleAddToCart = () => {
        addItem(product);
    };

    const handleAddToWishlist = () => {
        alert('Produto adicionado à lista de desejos!');
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link do produto copiado!');
    };

    return (
        <div className="product-info-section">
            <h1 className="product-title">{product.nome}</h1>
            <div className="product-prices">
                {product.preco_promocao && (
                    <span className="old-price">{`R$${product.preco_venda}`}</span>
                )}
                <span className="current-price">
                    {`R$${product.preco_promocao || product.preco_venda}`}
                </span>
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
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    <FaShoppingCart /> Carrinho
                </button>
                <button className="add-to-wishlist-btn" onClick={handleAddToWishlist}>
                    <FaHeart />
                </button>
            </div>
            <div className="share-section">
                <span>Compartilhar:</span>
                <FaShareAlt onClick={handleShare} className="share-icon" />
            </div>
        </div>
    );
};

export default ProductInfo;