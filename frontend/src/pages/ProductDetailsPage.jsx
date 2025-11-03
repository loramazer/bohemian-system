// src/pages/ProductDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import ProductInfo from '../components/ProductDetails/ProductInfo.jsx';
import ProductGallery from '../components/ProductDetails/ProductGallery.jsx';
import ProductTabs from '../components/ProductDetails/ProductTabs.jsx'; // Manter o import por enquanto, mas não usaremos

// 1. Importar a seção de produtos para usar como "Relacionados"
import FeaturedProductsSection from '../components/FeaturedProductsSection.jsx';

// 2. CSS da Página
import '../styles/ProductDetailsPage.css';
// 3. CSS dos Componentes (O que estava faltando)
import '../styles/ProductDetails.css';
// 4. CSS da seção de relacionados
import '../styles/FeaturedProductsSection.css';
import apiClient from '../api.js'; // Importar apiClient para fetch

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Vamos usar a rota da API configurada no seu vite.config.js
                const response = await apiClient.get(`/produtos/${productId}`);
                
                if (response.status !== 200) {
                    throw new Error('Erro ao buscar o produto');
                }
                const data = response.data;
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
            {/* CORREÇÃO: Mover o Breadcrumb para fora da tag <main> e corrigir a estrutura */}
            <div className="product-breadcrumbs">
                <Link to="/">Home</Link> &gt; <Link to="/products">Comprar</Link> &gt; <span>{productData.nome}</span>
            </div>
            
            <main className="product-details-main">
                
                {/* Layout Principal (Galeria + Infos, que agora inclui a descrição) */}
                <section className="product-details-layout">
                    <ProductGallery product={productData} />
                    <ProductInfo product={productData} /> 
                </section>
                
                {/* REMOVIDO: A seção de descrição separada <section className="product-tabs-container">
                    <ProductTabs product={productData}/>
                </section> */}

                {/* Produtos Relacionados */}
                <section className="related-products-container">
                    <FeaturedProductsSection />
                </section>
            </main>
        </ContentWrapper>
    );
};

export default ProductDetailsPage;