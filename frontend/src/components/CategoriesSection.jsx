// frontend/src/components/CategoriesSection.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Importa ícones (Selecionados para representar categorias amplas)
import { 
    FaCertificate, FaFire, FaTag,     // Destaques e Vendas
    FaSeedling, FaPalette, FaCube,     // Arranjos e Geral
    FaLeaf, FaStore, FaHeart, FaStar,  // Plantas, Decoração, Ocasiões, Secas
    FaGift                             // Presentes/Ocasiões
} from 'react-icons/fa'; 
import '../styles/CategoriesSection.css';
import apiClient from '../api';

// Mapeamento de Palavras-Chave (Mais Abrangente)
const iconKeywordsMap = {
    // Correspondência Exata / Palavras de Destaque
    'novidades': FaCertificate, 
    'mais vendidos': FaFire, 
    'ofertas': FaTag,
    
    // Palavras-Chave mais genéricas e abrangentes (Foco na NATUREZA/USO)
    'buque': FaSeedling,      // Buquê, buquês, noiva
    'arranjo': FaPalette,     // Arranjo, arranjos, mesa
    'vaso': FaStore,          // Vaso, vasos (para produtos em recipientes)
    'decora': FaStore,        // Decoração, decorativos
    'seco': FaStar,           // Secas, desidratadas (para durabilidade)
    'desidratad': FaStar,     // Desidratadas, secas
    'planta': FaLeaf,         // Plantas, mudas, vegetação
    'natural': FaLeaf,        // Plantas naturais, flores frescas
    'casamento': FaHeart,     // Ocasião romântica/especial
    'romance': FaHeart,       
    'aniversa': FaGift,       // Aniversário, presente
    'ocasio': FaGift,         // Ocasião especial
    
    // Fallback
    'default': FaCube, 
};

// FUNÇÃO CRÍTICA: Resolve o ícone procurando pela palavra-chave mais relevante no nome.
const getIconComponent = (categoryName) => {
    const nameLower = categoryName.toLowerCase();
    
    // 1. Tenta a correspondência exata primeiro (para novidades, ofertas)
    if (iconKeywordsMap[nameLower]) {
        return iconKeywordsMap[nameLower];
    }
    
    // 2. Itera sobre o mapa de palavras-chave mais abrangentes.
    for (const [keyword, Icon] of Object.entries(iconKeywordsMap)) {
        if (nameLower.includes(keyword)) {
            // Se encontrar a palavra-chave (ex: "vaso"), retorna o ícone
            return Icon;
        }
    }

    // 3. Retorna o ícone de fallback genérico se nenhuma palavra-chave for encontrada
    return iconKeywordsMap['default'];
};


const CategoriesSection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('/api/categorias');

                if (Array.isArray(response.data)) {
                    // Apenas utiliza os dados vindos do banco de dados.
                    setCategories(response.data);
                } else {
                    setCategories([]); 
                }
            } catch (err) {
                console.error("Erro ao carregar categorias:", err);
                setCategories([]); 
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
                        // Usa a função flexível para definir o ícone
                        const IconComponent = getIconComponent(category.nome);
                        
                        return (
                            <Link 
                                to={`/products?categories=${category.id_categoria}`} 
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