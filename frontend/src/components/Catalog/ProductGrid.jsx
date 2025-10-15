// src/components/Catalog/ProductGrid.jsx

import React, { useContext } from 'react'; // NOVO: Importa useContext
import { Link, useNavigate } from 'react-router-dom'; // NOVO: Importa useNavigate
import ProductCard from '../Shared/ProductCard.jsx';
import '../../styles/ProductGrid.css';
import { CartContext } from '../../context/CartContext.jsx'; // NOVO: CartContext
import { AuthContext } from '../../context/AuthContext.jsx'; // NOVO: AuthContext

const ProductGrid = ({ products }) => {
    const { addItem } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // NOVO: Função para lidar com o clique no botão "Adicionar ao Carrinho"
    const handleAddToCartClick = (e, product) => {
        e.preventDefault(); 
        e.stopPropagation();

        if (!user) {
            navigate('/require-login'); 
            return;
        }
        try { addItem(product); 
        } catch (error) {
            alert('Falha ao adicionar o produto. Tente novamente.');
            console.error('Erro ao adicionar ao carrinho:', error);
        }
        
    };

    return (
        <div className="product-grid-container">
            <div className="product-grid">
                {products && products.length > 0 ? (
                    products.map(product => (
                            <ProductCard 
                                product={product} 
                                // NOVO: Passa a função de clique para o ProductCard
                                onAddToCart={(e) => handleAddToCartClick(e, product)}
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