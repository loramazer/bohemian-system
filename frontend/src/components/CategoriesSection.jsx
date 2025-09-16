<<<<<<< HEAD
import React, { useState } from 'react';
import ProductCard from './ProductCard.jsx';
import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';

const IMAGES = [img1, img2, img3, img4, img5];

const categories = {
    'novidades': [
        { id: 5, name: 'Box Flores Mistas', price: 'R$270', oldPrice: 'R$290', image: img1, tag: null },
        { id: 6, name: 'Wine Box + Lindt', price: 'R$140', oldPrice: 'R$160', image: img2, tag: 'Sale' },
        { id: 7, name: 'Box Mistas + Frisante', price: 'R$340', oldPrice: null, image: img3, tag: null },
    ],
    'mais-vendidos': [
        { id: 8, name: 'Box Flores Mistas', price: 'R$270', oldPrice: 'R$290', image: img4, tag: null },
        { id: 9, name: 'Box Flores Mistas', price: 'R$270', oldPrice: null, image: img5, tag: null },
        { id: 10, name: 'Box Flores Mistas', price: 'R$270', oldPrice: null, image: img1, tag: null },
    ],
    'dia-dos-namorados': [],
    'ofertas': [],
};

const CategoriesSection = () => {
    const [activeTab, setActiveTab] = useState('novidades');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <section className="categories-section">
            <h2 className="section-title">Categorias</h2>
            <div className="categories-tabs">
                <button className={`tab-button ${activeTab === 'novidades' ? 'active' : ''}`} onClick={() => handleTabClick('novidades')}>Novidades</button>
                <button className={`tab-button ${activeTab === 'mais-vendidos' ? 'active' : ''}`} onClick={() => handleTabClick('mais-vendidos')}>Mais Vendidos</button>
                <button className={`tab-button ${activeTab === 'dia-dos-namorados' ? 'active' : ''}`} onClick={() => handleTabClick('dia-dos-namorados')}>Dia dos Namorados</button>
                <button className={`tab-button ${activeTab === 'ofertas' ? 'active' : ''}`} onClick={() => handleTabClick('ofertas')}>Ofertas</button>
            </div>
            <div className="products-grid">
                {categories[activeTab].map((product, index) => (
                    <ProductCard
                        key={product.id}
                        name={product.name}
                        price={product.price}
                        oldPrice={product.oldPrice}
                        imageSrc={IMAGES[index % IMAGES.length]}
                        tag={product.tag}
                    />
                ))}
            </div>
        </section>
=======
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
>>>>>>> origin/front-back-carrinhos
    );
};

export default CategoriesSection;