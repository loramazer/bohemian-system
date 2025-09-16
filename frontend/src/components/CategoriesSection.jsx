// frontend/src/components/CategoriesSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importe o Link para navegação
import { FaTshirt, FaMobileAlt, FaLaptop, FaBook, FaHome, FaQuestionCircle } from 'react-icons/fa';
import '../styles/CategoriesSection.css';
import apiClient from '../api';

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

                // 1. Verifica se a resposta da API é um array
                if (Array.isArray(response.data)) {
                    setCategories(response.data);
                } else {
                    // Se não for, evita o erro e informa no console
                    console.error("A resposta da API de categorias não é um array:", response.data);
                    setError('Erro ao carregar os dados das categorias.');
                    setCategories([]);
                }
            } catch (err) {
                setError('Não foi possível carregar as categorias.');
                console.error(err);
            } finally {
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
                {categories.length > 0 ? (
                    categories.map((category) => {
                        // 2. Use 'nome_categoria' para buscar o ícone
                        const IconComponent = iconMap[category.nome_categoria] || iconMap['default'];
                        return (
                            // 3. O 'key' deve usar 'id_categoria' e o Link deve ser usado aqui
                            <Link to={`/catalog?category=${category.nome_categoria}`} key={category.id_categoria} className="category-card">
                                <IconComponent className="category-icon" />
                                {/* 4. Exiba 'nome_categoria' */}
                                <p>{category.nome_categoria}</p>
                            </Link>
                        );
                    })
                ) : (
                    <p>Nenhuma categoria encontrada.</p>
                )}
            </div>
        </div>
    );
};

export default CategoriesSection;