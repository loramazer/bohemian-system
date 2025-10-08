// src/pages/ProductDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import ProductInfo from '../components/ProductDetails/ProductInfo.jsx';
import ProductGallery from '../components/ProductDetails/ProductGallery.jsx';
import ProductTabs from '../components/ProductDetails/ProductTabs.jsx';

import '../styles/ProductDetailsPage.css';

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // CORRIGIDO: Adicionando o prefixo /api
                const response = await fetch(`http://localhost:3000/api/produtos/${productId}`);
                
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
                <div className="product-details-layout">
                    <ProductGallery product={productData} />
                    <ProductInfo product={productData} />
                </div>
                <ProductTabs />
            </main>
        </ContentWrapper>
    );
};

export default ProductDetailsPage;