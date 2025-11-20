import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import ProductInfo from '../components/ProductDetails/ProductInfo.jsx';
import ProductGallery from '../components/ProductDetails/ProductGallery.jsx';
import ProductTabs from '../components/ProductDetails/ProductTabs.jsx'; 

import FeaturedProductsSection from '../components/FeaturedProductsSection.jsx';

import '../styles/ProductDetailsPage.css';
import '../styles/ProductDetails.css';
import '../styles/FeaturedProductsSection.css';
import apiClient from '../api.js'; 

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await apiClient.get(`/api/produtos/${productId}`);
                
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
            {}
            <div className="product-breadcrumbs">
                <Link to="/">Home</Link> &gt; <Link to="/products">Comprar</Link> &gt; <span>{productData.nome}</span>
            </div>
            
            <main className="product-details-main">
                
                {}
                <section className="product-details-layout">
                    <ProductGallery product={productData} />
                    <ProductInfo product={productData} /> 
                </section>
                
                {}

                {}
                <section className="related-products-container">
                    <FeaturedProductsSection />
                </section>
            </main>
        </ContentWrapper>
    );
};

export default ProductDetailsPage;