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
    const categoryFilterCSV = query.get('categoria'); 
    const categoryFilter = categoryFilterCSV ? categoryFilterCSV.split(',') : [];
    const searchFilter = query.get('search'); 

    useEffect(() => {
        const fetchProducts = async (categoriesArray, searchFilter) => { 
            setLoading(true); 
            setError(null);
            try { // INÍCIO DO TRY
                let url = '/produtos';
                const params = new URLSearchParams();
                let hasFilter = false;

                if (categoriesArray.length > 0) {
                    params.append('categoria', categoriesArray.join(','));
                    hasFilter = true;
                }
                
                if (searchFilter) {
                    params.append('search', searchFilter);
                    hasFilter = true;
                }
                
                if (hasFilter) {
                    url = `/produtos?${params.toString()}`;
                }
                

                const response = await apiClient.get(url);
                
                // CÓDIGO CORRIGIDO: Este bloco deve estar DENTRO do try
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                } else {
                    setError('Formato de dados inesperado.');
                    setProducts([]);
                }
            } catch (err) { // FIM DO TRY, INÍCIO DO CATCH
                setError('Não foi possível carregar os produtos do catálogo.');
                console.error('Erro ao carregar catálogo:', err);
            } finally {
                setLoading(false);
            }
        };

       fetchProducts(categoryFilter, searchFilter); 
    }, [categoryFilterCSV, searchFilter]);


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
                   <Sidebar activeCategories={categoryFilter} /> 
                    <ProductGrid products={products} />
                </div>
            </main>
        </ContentWrapper>
    );
};

export default CatalogPage;