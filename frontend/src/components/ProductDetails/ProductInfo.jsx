import React, { useContext } from 'react';

import { FaHeart, FaShareAlt, FaShoppingCart, FaRegHeart } from 'react-icons/fa'; // NOVO: FaRegHeart
import { CartContext } from '../../context/CartContext.jsx'; 
// NOVO: Importar WishlistContext
import { WishlistContext } from '../../context/WishlistContext.jsx'; 

const ProductInfo = ({ product }) => {
    const { addItem } = useContext(CartContext);
    // REMOVIDO: showWishlistSuccess (agora está no WishlistContext)
    
    // NOVO: Consumir WishlistContext
    const { addWishlistItem, removeWishlistItem, isFavorited } = useContext(WishlistContext);

    // Lógica do carrinho (sem alteração)
    const handleAddToCart = () => {
        addItem(product);
    };

    // NOVO: Lógica de Wishlist atualizada
    const handleAddToWishlist = () => {
        if (isFavorited(product.id_produto)) {
            removeWishlistItem(product.id_produto);
        } else {
            addWishlistItem(product);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link do produto copiado!');
    };

    const isLiked = isFavorited(product.id_produto);

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
            {<div className="product-rating">
                {/* Estrelas de avaliação */}
            </div>}
            <div className="color-options">
                {/*<span>Cores:</span>*/}
                {/* Aqui você pode mapear as cores se tiver no banco */}
            </div>
            <div className="product-actions">
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    <FaShoppingCart /> Carrinho
                </button>
                <button className="add-to-wishlist-btn" onClick={handleAddToWishlist}>
                    {isLiked ? <FaHeart style={{ color: '#e74c3c' }} /> : <FaRegHeart />}
                </button>
            </div>
            <div className="share-section">
                <span>Compartilhar:</span>
                <button className="share-btn" onClick={handleShare}>
                    <FaShareAlt />
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;