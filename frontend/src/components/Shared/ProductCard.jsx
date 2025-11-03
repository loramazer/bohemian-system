// frontend/src/components/Shared/ProductCard.jsx

import React, { useContext } from 'react';
// CORREÇÃO: Importa FaHeart (coração preenchido)
import { FaShoppingCart, FaRegHeart, FaHeart } from 'react-icons/fa';
import '../../styles/ProductCard.css';
import placeholderImage from '../../../public/5.png';
import { Link } from 'react-router-dom';
// CORREÇÃO: Usa o WishlistContext para verificar o status
import { WishlistContext } from '../../context/WishlistContext.jsx'; 

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => { 
    // Consome o WishlistContext
    const { isFavorited } = useContext(WishlistContext);
    
    if (!product) {
        return null;
    }
    
    // Verifica se este item está favoritado
    const isLiked = isFavorited(product.id_produto);

    // Lógica para extrair a primeira imagem do JSON
    let displayImage = product.imagem_url;
    try {
        const parsedUrls = JSON.parse(product.imagem_url);
        if (Array.isArray(parsedUrls) && parsedUrls.length > 0) {
            displayImage = parsedUrls[0];
        }
    } catch (e) {
        // Ignora o erro se já for uma URL simples
    }

    // Lógica de formatação de preço (incluindo preço promocional)
    const priceToFormat = product.preco_promocao || product.preco_venda;
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(priceToFormat);

    const oldPrice = product.preco_promocao ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(product.preco_venda) : null;
    
    const tagText = product.preco_promocao ? 'PROMOÇÃO' : (product.tag || null);
    
    // Lógica de clique (chama a função do pai, que agora vem do WishlistContext)
    const handleWishlistClick = (e) => {
        if (onAddToWishlist) {
            onAddToWishlist(e); 
        }
    };


    return (
        <Link
            to={`/product/${product.id_produto}`}
            key={product.id_produto}
            style={{ textDecoration: 'none' }}
        >
            <div className="product-card">
                {tagText && <span className="product-tag">{tagText}</span>}
                
                <div className="product-image-container">
                    <img 
                        src={displayImage || placeholderImage} 
                        alt={product.nome} 
                        className="product-image" 
                    />
                    
                    <div className="product-actions">
                        <button 
                            className="add-to-cart-btn" 
                            onClick={onAddToCart}
                        >
                            <FaShoppingCart /> Adicionar ao Carrinho
                        </button>
                        
                        <button 
                            className="wishlist-btn"
                            onClick={handleWishlistClick} 
                        >
                            {/* Lógica para mostrar coração preenchido ou vazio */}
                            {isLiked ? <FaHeart style={{ color: '#e74c3c' }} /> : <FaRegHeart />}
                        </button>
                    </div>
                </div>
                
                {/* CORREÇÃO: Este <div> é essencial. 
                  Ele agrupa o nome e o preço, e o CSS .product-prices (dentro dele) 
                  usa 'margin-top: auto' para empurrar o preço para o final do card.
                */}
                <div className="product-info">
                    <h3 className="product-name">{product.nome}</h3>
                    
                    <div className="product-prices">
                        {oldPrice && <span className="old-price">{oldPrice}</span>}
                        <span className="current-price">{formattedPrice}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;