// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/components/Shared/ProductCard.jsx

import React from 'react';
import { FaShoppingCart, FaRegHeart } from 'react-icons/fa';
import '../../styles/ProductCard.css';
import placeholderImage from '../../assets/5.png';
import { Link, useNavigate } from 'react-router-dom';

// NOVO: Adiciona onAddToWishlist às props
const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => { 
    // Se não houver produto, não renderiza nada.
    if (!product) {
        return null;
    }

    // CRÍTICO: NOVO BLOCO PARA EXTRAIR A PRIMEIRA URL DA GALERIA (STRING JSON)
    let displayImage = product.imagem_url;
    try {
        const parsedUrls = JSON.parse(product.imagem_url);
        // Se for um array de strings, pegue o primeiro elemento
        if (Array.isArray(parsedUrls) && parsedUrls.length > 0) {
            displayImage = parsedUrls[0];
        }
    } catch (e) {
        // Se falhar o parse, significa que era uma string de URL simples,
        // então mantemos o valor original em displayImage.
        // console.error("Erro ao fazer parse da URL da imagem:", e);
    }
    // FIM DO NOVO BLOCO

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


    return (
        // O <Link> principal continua permitindo a navegação para os detalhes do produto ao clicar no card, exceto nos botões.
        <Link
            to={`/product/${product.id_produto}`}
            key={product.id_produto}
            style={{ textDecoration: 'none' }}
        >
            <div className="product-card">
                {tagText && <span className="product-tag">{tagText}</span>}
                
                <div className="product-image-container">
                    <img 
                        // CRÍTICO: Usa a URL processada (displayImage)
                        src={displayImage || placeholderImage} 
                        alt={product.nome} 
                        className="product-image" 
                    />
                    
                    <div className="product-actions">
                        {/* Botão Adicionar ao Carrinho: Chama a prop onAddToCart */}
                        <button 
                            className="add-to-cart-btn" 
                            onClick={onAddToCart}
                        >
                            <FaShoppingCart /> Adicionar ao Carrinho
                        </button>
                        
                        {/* CRÍTICO: Botão Favoritos: Chama a nova prop onAddToWishlist */}
                        <button 
                            className="wishlist-btn"
                            onClick={onAddToWishlist} 
                        >
                            <FaRegHeart />
                        </button>
                    </div>
                </div>
                
                <div className="product-info">
                    <h3 className="product-name">{product.nome}</h3>
                    
                    <div className="product-prices">
                        {/* Exibe o preço antigo se houver promoção */}
                        {oldPrice && <span className="old-price">{oldPrice}</span>}
                        <span className="current-price">{formattedPrice}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;