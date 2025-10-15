import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './Shared/ProductCard';
import '../styles/FeaturedProductsSection.css';
import apiClient from '../api';
import { CartContext } from '../context/CartContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx'; 
// OBS: Assumindo que você terá um WishlistContext ou que a lógica só verifica o login
// Se você quiser adicionar o item aos favoritos, você faria a chamada de API aqui.

const FeaturedProductsSection = () => {
    // ... (Estados e Contextos existentes)
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addItem } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // ... (useEffect existente para carregar produtos)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiClient.get('/produtos');

                if (Array.isArray(response.data)) {
                    setProducts(response.data.slice(0, 8));
                } else {
                    console.error("A resposta da API não é um array:", response.data);
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
    // ...

    // Lógica de clique para ADICIONAR AO CARRINHO (já existente)
    const handleAddToCartClick = (e, product) => {
        e.preventDefault(); 
        e.stopPropagation();

        if (!user) {
            navigate('/require-login'); 
            return;
        }
        
        addItem(product);
    };

    // CRÍTICO: NOVA Lógica de clique para ADICIONAR AOS FAVORITOS
    const handleAddToWishlistClick = (e, product) => {
        e.preventDefault(); 
        e.stopPropagation();

        if (!user) {
            navigate('/require-login'); 
            return;
        }
        
        // Aqui você faria a chamada de API para adicionar o produto à lista de desejos
        console.log(`Produto ${product.nome} adicionado aos favoritos!`); 
        // Exemplo: addWishlistItem(product.id_produto);
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
                        // Passa o manipulador do Carrinho
                        onAddToCart={(e) => handleAddToCartClick(e, product)}
                        // CRÍTICO: Passa o novo manipulador de Favoritos
                        onAddToWishlist={(e) => handleAddToWishlistClick(e, product)}
                    />
                ))}
            </div>
        </section>
    );
};

export default FeaturedProductsSection;