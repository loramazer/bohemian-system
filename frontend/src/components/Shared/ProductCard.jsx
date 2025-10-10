import React from 'react';
import { FaShoppingCart, FaRegHeart } from 'react-icons/fa';
import '../../styles/ProductCard.css';
import placeholderImage from '../../assets/5.png'; // Caminho para imagem placeholder

// NOVO: Adicione 'onAddToCart' nas props
const ProductCard = ({ product, onAddToCart }) => {
    // Se não houver produto, não renderiza nada para evitar erros.
    // Isso garante que o código não falhe se o objeto 'product' não for passado.
    if (!product) {
        return null;
    }

    // O campo de preço no banco é 'preco_venda', não 'preco'.
    const priceToFormat = product.preco_promocao || product.preco_venda;
    
    // Formata o preço para o padrão brasileiro
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(priceToFormat);

    // Determina o preço antigo (riscado) se houver promoção
    const oldPrice = product.preco_promocao ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(product.preco_venda) : null;
    
    // Determina a tag se houver promoção
    // Mantendo a lógica de tag que você havia definido
    const tagText = product.preco_promocao ? 'PROMOÇÃO' : (product.tag || null);


    return (
        <div className="product-card">
            {tagText && <span className="product-tag">{tagText}</span>}
            
            <div className="product-image-container">
                {/* Usamos a imagem do produto se existir, senão, a imagem placeholder */}
                <img 
                    src={product.imagem_url || placeholderImage} 
                    alt={product.nome} 
                    className="product-image" 
                />
                
                <div className="product-actions">
                    {/* NOVO: Aplica a função onAddToCart no clique do botão */}
                    <button className="add-to-cart-btn" onClick={onAddToCart}>
                        <FaShoppingCart /> Adicionar ao Carrinho
                    </button>
                    <button className="wishlist-btn">
                        <FaRegHeart />
                    </button>
                </div>
            </div>
            
            <div className="product-info">
                <h3 className="product-name">{product.nome}</h3>
                {/* <p className="product-code">{product.codigo_produto}</p> */}
                
                <div className="product-prices">
                    {/* Exibe o preço antigo se houver promoção */}
                    {oldPrice && <span className="old-price">{oldPrice}</span>}
                    <span className="current-price">{formattedPrice}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;