// src/pages/ProductDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import ProductInfo from '../components/ProductDetails/ProductInfo.jsx';
import ProductGallery from '../components/ProductDetails/ProductGallery.jsx';
import ProductTabs from '../components/ProductDetails/ProductTabs.jsx';

// 1. Importar a seção de produtos para usar como "Relacionados"
import FeaturedProductsSection from '../components/FeaturedProductsSection.jsx';

// 2. CSS da Página
import '../styles/ProductDetailsPage.css';
// 3. CSS dos Componentes (O que estava faltando)
import '../styles/ProductDetails.css';
// 4. CSS da seção de relacionados
import '../styles/FeaturedProductsSection.css';


const ProductDetailsPage = () => {
    const { productId } = useParams();
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Vamos usar a rota da API configurada no seu vite.config.js
                const response = await fetch(`/api/produtos/${productId}`);
                
                if (!response.ok) {
                    throw new Error('Erro ao buscar o produto');
                }
                const data = await response.json();
                setProductData(data);
            } catch (error) {
                console.error('Erro ao buscar detalhes do produto:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    if (!productData) {
        return <ContentWrapper><div>Carregando...</div></ContentWrapper>;
    }

    return (
        <ContentWrapper>
            <main className="product-details-main">
                <div className="product-breadcrumbs">
                    <Link to="/">Home</Link> &gt; <Link to="/products">Comprar</Link> &gt; <span>{productData.nome}</span>
                </div>
                
                {/* Layout Principal (Galeria + Infos) */}
                <section className="product-details-layout">
                    <ProductGallery product={productData} />
                    <ProductInfo product={productData} />
                </section>
                
                {/* Descrição (Aba "Sobre o Produto") */}
                <section className="product-tabs-container">
                    <ProductTabs product={productData}/>
                </section>

                {/* Produtos Relacionados */}
                <section className="related-products-container">
                    {/* Reutiliza o componente que você já tem */}
                    <FeaturedProductsSection />
                </section>
            </main>
        </ContentWrapper>
    );
};

export default ProductDetailsPage;