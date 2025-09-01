// frontend/src/components/CategoriesSection.jsx
import React, { useState, useEffect } from 'react';
import { FaTshirt, FaMobileAlt, FaLaptop, FaBook, FaHome, FaQuestionCircle } from 'react-icons/fa';
import '../styles/CategoriesSection.css';
import apiClient from '../api'; // Importa nosso conector da API

// Mapeamento de ícones (pode ser melhorado depois)
const iconMap = {
    'Buquês': FaTshirt,
    'Arranjos': FaMobileAlt,
    'Vasos': FaLaptop,
    'Cestas': FaBook,
    'Orquídeas': FaHome,
    'default': FaQuestionCircle,
};

const CategoriesSection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('/categorias');
                setCategories(response.data);
                setLoading(false);
            } catch (err) {
                setError('Não foi possível carregar as categorias.');
                console.error(err);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <div className="categories-container"><p>Carregando categorias...</p></div>;
    }

    if (error) {
        return <div className="categories-container"><p>{error}</p></div>;
    }

    return (
        <div className="categories-container">
            <h2>Categorias</h2>
            <div className="categories-grid">
                {categories.map((category) => {
                    const IconComponent = iconMap[category.nome] || iconMap['default'];
                    return (
                        <div key={category.categoria_id} className="category-card">
                            <IconComponent className="category-icon" />
                            <p>{category.nome}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoriesSection;