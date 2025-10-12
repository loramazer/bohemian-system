// frontend/src/components/CategoriesSection.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Importa mais ícones para ter mais opções de mapeamento
import { FaHome, FaQuestionCircle, FaCertificate, FaFire, FaGift, FaTag, FaSeedling, FaPalette } from 'react-icons/fa'; 
import '../styles/CategoriesSection.css';
import apiClient from '../api';

// CORREÇÃO CRÍTICA: Mapeamento de Ícones
// Adiciona ícones para filtros estáticos populares (Novidades, Ofertas)
// E usa nomes genéricos que podem vir do banco (em minúsculo para robustez)
const iconMap = {
    // Ícones para filtros estáticos/marketing
    'Novidades': FaCertificate,
    'Mais Vendidos': FaFire,
    'Dia dos Namorados': FaGift,
    'Ofertas': FaTag,
    
    // Ícones para categorias do banco de dados (ajuste conforme o que seu banco retornar)
    'buque': FaSeedling,
    'arranjo': FaPalette,
    'default': FaQuestionCircle, // Mantém o fallback
};

// Se precisar de filtros estáticos na Home Page, defina-os aqui:
const staticFilters = [
    { id_categoria: 'novo', nome: 'Novidades' },
    { id_categoria: 'vendido', nome: 'Mais Vendidos' },
    { id_categoria: 'namorados', nome: 'Dia dos Namorados' },
    { id_categoria: 'ofertas', nome: 'Ofertas' },
];


const CategoriesSection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('/categorias');

                if (Array.isArray(response.data)) {
                    // Combina filtros estáticos (ex: Novidades) com categorias dinâmicas (do banco)
                    setCategories([...staticFilters, ...response.data]);
                } else {
                    console.error("A resposta da API de categorias não é um array:", response.data);
                    // Em caso de formato errado, mostra apenas os filtros estáticos para a UI
                    setCategories(staticFilters); 
                }
            } catch (err) {
                setError('Não foi possível carregar as categorias.');
                console.error(err);
                // Fallback: mostra apenas os filtros estáticos se a API falhar
                setCategories(staticFilters); 
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <div className="categories-container"><p>Carregando categorias...</p></div>;
    }

    // Renderiza a seção
    return (
        <div className="categories-container">
            <h2>Categorias</h2>
            <div className="categories-grid">
                {categories.length > 0 ? (
                    categories.map((category) => {
                        // Lógica para encontrar o ícone: tenta pelo nome exato, depois pelo nome em minúsculo
                        const iconKey = (category.nome || '').toLowerCase();
                        const IconComponent = iconMap[category.nome] || iconMap[iconKey] || iconMap['default'];
                        
                        return (
                            // CORREÇÃO DE ROTA: Liga a categoria à página /products (catálogo) com um filtro de query
                            <Link 
                                to={`/products?category=${category.nome}`} 
                                key={category.id_categoria} 
                                className="category-card"
                            >
                                <IconComponent className="category-icon" size={30} />
                                <p>{category.nome}</p>
                            </Link>
                        );
                    })
                ) : (
                    <p>Nenhuma categoria ou filtro encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default CategoriesSection;