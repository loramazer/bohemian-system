// src/components/Catalog/ProductGrid.jsx

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../Shared/ProductCard.jsx';
import '../../styles/ProductGrid.css';
import { CartContext } from '../../context/CartContext.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { WishlistContext } from '../../context/WishlistContext.jsx'; // Importe o WishlistContext

const ProductGrid = ({ products }) => {
    const { addItem } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    // Consumir o WishlistContext
    const { addWishlistItem, removeWishlistItem, isFavorited } = useContext(WishlistContext);
    const navigate = useNavigate();

    // Função do Carrinho
    const handleAddToCartClick = (e, product) => {
        e.preventDefault(); 
        e.stopPropagation();
        if (!user) {
            navigate('/require-login'); 
            return;
        }
        try { 
            addItem(product); // Chama o Contexto do Carrinho
        } catch (error) {
            alert('Falha ao adicionar o produto. Tente novamente.');
            console.error('Erro ao adicionar ao carrinho:', error);
        }
    };

    // Função da Lista de Desejos
    const handleAddToWishlistClick = (e, product) => {
        e.preventDefault(); 
        e.stopPropagation();
        if (!user) {
            navigate('/require-login'); 
            return;
        }
        // Lógica de adicionar/remover
        if (isFavorited(product.id_produto)) {
            removeWishlistItem(product.id_produto);
        } else {
            addWishlistItem(product); // Chama o Contexto da Wishlist
        }
    };

    return (
        <div className="product-grid-container">
            <div className="product-grid">
                {products && products.length > 0 ? (
                    products.map(product => (
                        <ProductCard 
                            key={product.id_produto}
                            product={product}
                            
                            // --- CORREÇÃO AQUI ---
                            // Garanta que o botão de Carrinho (onAddToCart) chama a função do Carrinho
                            onAddToCart={(e) => handleAddToCartClick(e, product)}
                            
                            // Garanta que o botão de Coração (onAddToWishlist) chama a função de Desejos
                            onAddToWishlist={(e) => handleAddToWishlistClick(e, product)} 
                        />
                    ))
                ) : (
                    <p>Nenhum produto encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default ProductGrid;