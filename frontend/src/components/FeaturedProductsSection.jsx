// frontend/src/components/FeaturedProductsSection.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import '../styles/FeaturedProductsSection.css';
import apiClient from '../api';

const FeaturedProductsSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiClient.get('/produtos');

                // --- CORREÇÃO AQUI ---
                // Verifique se a resposta da API é de fato um array antes de usá-la.
                if (Array.isArray(response.data)) {
                    setProducts(response.data.slice(0, 8)); // Pega apenas os 8 primeiros
                } else {
                    // Se não for um array, registre um erro e defina produtos como uma lista vazia.
                    console.error("A resposta da API não é um array:", response.data);
                    setError('Formato de dados inesperado recebido do servidor.');
                    setProducts([]);
                }
                // ---------------------

            } catch (err) {
                setError('Não foi possível carregar os produtos.');
                console.error(err);
            } finally {
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
                    // Adicione a key aqui, usando o ID do produto que vem do banco
                    <ProductCard key={product.id_produto} product={product} />
                ))}
            </div>
        </section>
    );
};

export default FeaturedProductsSection;