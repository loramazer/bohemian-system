// frontend/src/components/ProductDetails/ProductInfo.jsx

import React, { useContext } from 'react';
import { FaHeart, FaShareAlt, FaShoppingCart, FaRegHeart } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext.jsx'; 
import { WishlistContext } from '../../context/WishlistContext.jsx'; 
import { AuthContext } from '../../context/AuthContext.jsx'; 
import { useNavigate } from 'react-router-dom'; 

const ProductInfo = ({ product }) => {
    const { addItem } = useContext(CartContext);
    const { user } = useContext(AuthContext); 
    const { addWishlistItem, removeWishlistItem, isFavorited } = useContext(WishlistContext);
    const navigate = useNavigate();

    const priceToFormat = product.preco_promocao || product.preco_venda;
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(priceToFormat);

    const oldPrice = product.preco_promocao ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(product.preco_venda) : null;

    const handleAddToCart = () => {
        if (!user) {
            navigate('/require-login');
            return;
        }
        addItem(product);
    };

    const handleAddToWishlist = () => {
        if (!user) {
            navigate('/require-login');
            return;
        }
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
                {oldPrice && (
                    <span className="old-price">{oldPrice}</span>
                )}
                <span className="current-price">
                    {formattedPrice}
                </span>
            </div>
            
            <div className="product-description-detail">
                <h3>Sobre o Produto:</h3>
                <p>{product.descricao}</p>
            </div>
            
            <div className="detail-actions"> 
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    <FaShoppingCart /> Adicionar ao Carrinho
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