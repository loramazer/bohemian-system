// src/components/Catalog/ProductGrid.jsx

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../Shared/ProductCard.jsx';
import '../../styles/ProductGrid.css';
import { CartContext } from '../../context/CartContext.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { WishlistContext } from '../../context/WishlistContext.jsx'; 

const ProductGrid = ({ products }) => {
    const { addItem } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    
    const { addWishlistItem, removeWishlistItem, isFavorited } = useContext(WishlistContext);
    const navigate = useNavigate();

    const handleAddToCartClick = (e, product) => {
        e.preventDefault(); 
        e.stopPropagation();
        if (!user) {
            navigate('/require-login'); 
            return;
        }
        try { 
            addItem(product); 
        } catch (error) {
            alert('Falha ao adicionar o produto. Tente novamente.');
            console.error('Erro ao adicionar ao carrinho:', error);
        }
    };

    const handleAddToWishlistClick = (e, product) => {
        e.preventDefault(); 
        e.stopPropagation();
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

    return (
        <div className="product-grid-container">
            <div className="product-grid">
                {products && products.length > 0 ? (
                    products.map(product => (
                        <ProductCard 
                            key={product.id_produto}
                            product={product}
                            
                            onAddToCart={(e) => handleAddToCartClick(e, product)}
                            onAddToWishlist={(e) => handleAddToWishlistClick(e, product)} 
                        />
                    ))
                ) : (
                    <p></p>
                )}
            </div>
        </div>
    );
};

export default ProductGrid;