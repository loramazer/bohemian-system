import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import Sidebar from '../components/Catalog/Sidebar.jsx'; // Componente de barra lateral (com lógica de fetch)
import ProductGrid from '../components/Catalog/ProductGrid.jsx'; // Componente de exibição da grade
import apiClient from '../api.js'; // Para buscar os produtos

import '../styles/CatalogPage.css';

const CatalogPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    // Recupera o parâmetro 'category' da URL (usado para destaque visual ou filtro)
    const categoryFilter = query.get('category'); 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Busca todos os produtos. Em um sistema real, este endpoint
                // aceitaria um parâmetro de filtro de categoria (ex: /produtos?category=buques)
                const url = '/produtos';
                const response = await apiClient.get(url);
                
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                } else {
                    setError('Formato de dados inesperado.');
                    setProducts([]);
                }
            } catch (err) {
                setError('Não foi possível carregar os produtos do catálogo.');
                console.error('Erro ao carregar catálogo:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryFilter]); // Rebusca se o filtro de categoria mudar na URL


    if (loading) {
        return <ContentWrapper><p>Carregando catálogo...</p></ContentWrapper>;
    }

    if (error) {
        return <ContentWrapper><p>Erro: {error}</p></ContentWrapper>;
    }

    return (
        <ContentWrapper>
            <main className="catalog-main">
                <div className="page-header">
                    {/* Exibe o título e o filtro ativo (se houver) */}
                    <h2 className="page-title">Catálogo de Produtos {categoryFilter ? `(${categoryFilter})` : ''}</h2>
                </div>
                {/* O layout divide a tela entre a Sidebar e a Grade de Produtos */}
                <div className="catalog-layout">
                    <Sidebar />
                    <ProductGrid products={products} />
                </div>
            </main>
        </ContentWrapper>
    );
};

export default CatalogPage;