// src/pages/CatalogPage.jsx

import React, { useState, useEffect } from 'react';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import Sidebar from '../components/Catalog/Sidebar.jsx';
import ProductGrid from '../components/Catalog/ProductGrid.jsx';

import '../styles/CatalogPage.css';
import '../styles/Sidebar.css';
import '../styles/ProductGrid.css';
import '../styles/ProductCard.css';

const CatalogPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // CORRIGIDO: Adicionando o prefixo /api
                const response = await fetch('http://localhost:3000/api/produtos');
                if (!response.ok) {
                    throw new Error('Erro ao buscar produtos');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <ContentWrapper>
            <main className="catalog-main">
                <div className="page-header">
                    <h2>Comprar Produtos Bohemian</h2>
                    <div className="filter-sort-controls">
                        {/* Controles de filtro e ordenação aqui */}
                    </div>
                </div>
                <div className="catalog-layout">
                    <Sidebar />
                    <ProductGrid products={products} />
                </div>
            </main>
        </ContentWrapper>
    );
};

export default CatalogPage;