// frontend/src/components/CategoriesSection.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Importa ícones
import { FaQuestionCircle, FaCertificate, FaFire, FaGift, FaTag, FaSeedling, FaPalette, FaCube } from 'react-icons/fa'; 
import '../styles/CategoriesSection.css';
import apiClient from '../api';

// Mapeamento de Ícones para Nomes de Categoria. 
// O nome da chave deve corresponder exatamente ao 'nome' que vem do banco ou do filtro estático.
const iconMap = {
    'Novidades': FaCertificate, // Filtro estático
    'Mais Vendidos': FaFire,     // Filtro estático
    'Dia dos Namorados': FaGift, // Filtro estático
    'Ofertas': FaTag,            // Filtro estático
    // Categoria do banco de dados (Exemplo - use o nome EXATO do seu banco)
    'buque': FaSeedling, 
    'arranjo': FaPalette, 
    'default': FaCube, // Um ícone de fallback genérico
};

// Filtros estáticos que você quer exibir na Home Page
const staticFilters = [
    { id_categoria: 'f1', nome: 'Novidades' },
    { id_categoria: 'f2', nome: 'Mais Vendidos' },
    { id_categoria: 'f3', nome: 'Dia dos Namorados' },
    { id_categoria: 'f4', nome: 'Ofertas' },
];


const CategoriesSection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('/categorias');

                if (Array.isArray(response.data)) {
                    // CORREÇÃO: Usa um Set para remover duplicatas e combina com filtros estáticos
                    const combined = [...staticFilters, ...response.data];
                    const uniqueNames = new Set();
                    const uniqueCategories = combined.filter(cat => {
                        // Verifica se o nome já foi visto (para remover duplicação)
                        const isDuplicate = uniqueNames.has(cat.nome);
                        uniqueNames.add(cat.nome);
                        return !isDuplicate;
                    });
                    
                    setCategories(uniqueCategories);
                } else {
                    setCategories(staticFilters); 
                }
            } catch (err) {
                console.error("Erro ao carregar categorias:", err);
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

    return (
        <div className="categories-container">
            <h2>Categorias em Destaque</h2>
            <div className="categories-grid">
                {categories.length > 0 ? (
                    categories.map((category) => {
                        // Tenta encontrar o ícone.
                        const IconComponent = iconMap[category.nome] || iconMap[category.nome.toLowerCase()] || iconMap['default'];
                        
                        return (
                            // O Link aponta para o catálogo (/products) e passa o nome como filtro
                            <Link 
                                to={`/products?categoria=${encodeURIComponent(category.nome)}`} // Use 'categoria'
                                key={category.id_categoria} 
                                className="category-card"
                            >
                                <IconComponent className="category-icon" size={30} />
                                <p>{category.nome}</p>
                            </Link>
                        );
                    })
                ) : (
                    <p>Nenhuma categoria ou filtro disponível.</p>
                )}
            </div>
        </div>
    );
};

export default CategoriesSection;