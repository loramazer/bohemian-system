// frontend/src/components/CategoriesSection.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaCertificate, FaFire, FaTag,     
    FaSeedling, FaPalette, FaCube,     
    FaLeaf, FaStore, FaHeart, FaStar,  
    FaGift                             
} from 'react-icons/fa'; 
import '../styles/CategoriesSection.css';
import apiClient from '../api';

const iconKeywordsMap = {
    'novidades': FaCertificate, 
    'mais vendidos': FaFire, 
    'ofertas': FaTag,
    'buque': FaSeedling,   
    'arranjo': FaPalette,     
    'vaso': FaStore,         
    'decora': FaStore,       
    'seco': FaStar,           
    'desidratad': FaStar,    
    'planta': FaLeaf,         
    'natural': FaLeaf,        
    'casamento': FaHeart,     
    'romance': FaHeart,       
    'aniversa': FaGift,       
    'ocasio': FaGift,         
    'default': FaCube, 
};

const getIconComponent = (categoryName) => {
    const nameLower = categoryName.toLowerCase();
    
    if (iconKeywordsMap[nameLower]) {
        return iconKeywordsMap[nameLower];
    }
    
    for (const [keyword, Icon] of Object.entries(iconKeywordsMap)) {
        if (nameLower.includes(keyword)) {
            return Icon;
        }
    }
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