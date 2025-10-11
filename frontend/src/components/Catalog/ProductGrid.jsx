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
        // Impede a navegação para a página de detalhes
        e.preventDefault(); 
        e.stopPropagation();

        if (!user) {
            // Se o usuário não estiver logado, redireciona para a página de aviso
            navigate('/require-login'); 
            return;
        }
        
        // Se estiver logado, adiciona o item
        addItem(product);
    };

    return (
        <div className="product-grid-container">
            <div className="product-grid">
                {products && products.length > 0 ? (
                    products.map(product => (
                        <Link 
                            to={`/product/${product.id_produto}`} 
                            key={product.id_produto} 
                            style={{ textDecoration: 'none' }}
                        >
                            <ProductCard 
                                product={product} 
                                // NOVO: Passa a função de clique para o ProductCard
                                onAddToCart={(e) => handleAddToCartClick(e, product)}
                            />
                        </Link>
                    ))
                ) : (
                    <p>Nenhum produto encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default ProductGrid;