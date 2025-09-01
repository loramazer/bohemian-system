// frontend/src/components/FeaturedProductsSection.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard'; // O card do produto que já existe
import '../styles/FeaturedProductsSection.css';
import apiClient from '../api'; // Importa nosso conector da API

const FeaturedProductsSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Busca todos os produtos. Limitamos a 8 para o exemplo.
                const response = await apiClient.get('/produtos');
                setProducts(response.data.slice(0, 8)); // Pega apenas os 8 primeiros
                setLoading(false);
            } catch (err) {
                setError('Não foi possível carregar os produtos.');
                console.error(err);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
                    <ProductCard key={product.produto_id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default FeaturedProductsSection;