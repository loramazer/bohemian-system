import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './Shared/ProductCard';
import '../styles/FeaturedProductsSection.css';
import apiClient from '../api';
import { CartContext } from '../context/CartContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx'; 
import { WishlistContext } from '../context/WishlistContext.jsx'; // Importe o WishlistContext

const FeaturedProductsSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addItem } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { addWishlistItem, removeWishlistItem, isFavorited } = useContext(WishlistContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiClient.get('/api/produtos', { params: { limit: 8 } });
                
                if (response.data && Array.isArray(response.data.products)) {
                    setProducts(response.data.products); 
                } else {
                    setError('Formato de dados inesperado recebido do servidor.');
                    setProducts([]);
                }
            } catch (err) {
                setError('Não foi possível carregar os produtos.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCartClick = (e, product) => {
        e.preventDefault(); 
        e.stopPropagation();
        if (!user) {
            navigate('/require-login'); 
            return;
        }
        addItem(product); 
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

    if (loading) {
        return <section className="featured-products"><p>Carregando produtos...</p></section>;
    }

    if (error) {
        return <section className="featured-products"><p>{error}</p></section>;
    }

    return (
        <section className="featured-products">
            <h2>Produtos em Destaque</h2>
            <div className="products-grid">
                {products.map((product) => (
                    <ProductCard 
                        key={product.id_produto} 
                        product={product} 
                        
                        onAddToCart={(e) => handleAddToCartClick(e, product)}
                        
                        onAddToWishlist={(e) => handleAddToWishlistClick(e, product)}
                    />
                ))}
            </div>
        </section>
    );
};

export default FeaturedProductsSection;