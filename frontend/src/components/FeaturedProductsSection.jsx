<<<<<<< HEAD
import React from 'react';
import ProductCard from './ProductCard.jsx';
import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';

const IMAGES = [img1, img2, img3, img4, img5];

const featuredProducts = [
    { id: 1, name: 'Cone de Flores', code: '132301', price: 'R$99,00', tag: null },
    { id: 2, name: 'Bohemian Glass', code: '151230', price: 'R$129,00', tag: 'New' },
    { id: 3, name: 'Rosa com Lindt', code: '122201', price: 'R$42,00', tag: null },
    { id: 4, name: 'Mini Desidratado', code: '152201', price: 'R$59,00', tag: null },
];

const FeaturedProductsSection = () => {
    return (
        <section className="featured-products">
            <h2 className="section-title">Produtos em Destaque</h2>
            <div className="products-grid">
                {featuredProducts.map((product, index) => (
                    <ProductCard
                        key={product.id}
                        name={product.name}
                        code={product.code}
                        price={product.price}
                        imageSrc={IMAGES[index % IMAGES.length]}
                        tag={product.tag}
                    />
=======
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
>>>>>>> origin/front-back-carrinhos
                ))}
            </div>
        </section>
    );
};

export default FeaturedProductsSection;