// NOVO CÓDIGO SUGERIDO para frontend/src/components/Catalog/Sidebar.jsx

import React, { useState, useEffect } from 'react';
import '../../styles/Sidebar.css';
import apiClient from '../../api.js'; // Importa o cliente Axios

const Sidebar = () => {
    const [categories, setCategories] = useState([]);
    const [priceRange, setPriceRange] = useState(100); 

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // CORRIGIDO: Usando apiClient (Axios) para buscar categorias
                const response = await apiClient.get('/categorias');
                
                const data = response.data; 
                
                if (!Array.isArray(data)) {
                    throw new Error('Formato de dados inesperado');
                }
                setCategories(data);
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <aside className="catalog-sidebar">
            <div className="filter-group">
                <h4>Categorias</h4>
                <ul>
                    {categories.map((category) => (
                        <li key={category.id_categoria}>
                            <input type="checkbox" id={`cat-${category.id_categoria}`} />
                            <label htmlFor={`cat-${category.id_categoria}`}>{category.nome}</label>
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* Filtro de Preço (Range Slider) */}
            <div className="filter-group price-filter">
                <h4>Filtrar por Preço</h4>
                <input 
                    type="range" 
                    min="0" 
                    max="500" 
                    value={priceRange} 
                    onChange={(e) => setPriceRange(e.target.value)} 
                />
                <p>Preço Máximo: R${priceRange},00</p>
                <button className="apply-filter-btn">Aplicar</button>
            </div>
            
        </aside>
    );
};

export default Sidebar;