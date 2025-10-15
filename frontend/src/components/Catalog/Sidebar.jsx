// NOVO CÓDIGO SUGERIDO para frontend/src/components/Catalog/Sidebar.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/Sidebar.css';
import apiClient from '../../api.js'; // Importa o cliente Axios

const Sidebar = ({ activeCategories }) => {
    const [categories, setCategories] = useState([]);
    const [priceRange, setPriceRange] = useState(100); 
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // CORRIGIDO: Usando apiClient (Axios) para buscar categorias
                const response = await apiClient.get('/categorias');
                
                const data = response.data; 
                
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
            }
        };
        fetchCategories();
    }, []);

const handleCategoryCheck = (categoryName, isChecked) => {
        const query = new URLSearchParams(location.search);
        
        // Pega as categorias atualmente ativas (pode ser uma string separada por vírgulas)
        const currentCategories = query.get('categoria') ? query.get('categoria').split(',') : [];
        let newCategories = [...currentCategories];

        if (isChecked) {
            // Adicionar categoria se não estiver presente
            if (!newCategories.includes(categoryName)) {
                newCategories.push(categoryName);
            }
        } else {
            // Remover categoria
            newCategories = newCategories.filter(name => name !== categoryName);
        }

        if (newCategories.length > 0) {
            // Junta o array de volta em uma string separada por vírgula para a URL
            query.set('categoria', newCategories.join(','));
        } else {
            // Remove o parâmetro se não houver categorias selecionadas
            query.delete('categoria');
        }

        // Navega para a nova URL, mantendo outros filtros como 'search'
        navigate(`?${query.toString()}`, { replace: true });
    };

    return (
        <aside className="catalog-sidebar">
            <div className="filter-group">
                <h4>Categorias</h4>
                <ul>
                    {categories.map((category) => (
                        <li key={category.id_categoria}>
                            <input 
                                type="checkbox" 
                                id={`cat-${category.id_categoria}`} 
                                // Verifica se o nome da categoria está presente no array activeCategories
                                checked={activeCategories.includes(category.nome)} 
                                onChange={(e) => handleCategoryCheck(category.nome, e.target.checked)}
                            />
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