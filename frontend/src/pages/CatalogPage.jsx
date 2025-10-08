// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/components/Catalog/Sidebar.jsx

import React, { useState, useEffect } from 'react';
import '../styles/Sidebar.css';
import apiClient from '../api.js'; // NOVO: Importa o cliente Axios

const Sidebar = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // CORRIGIDO: Usando apiClient (Axios)
                const response = await apiClient.get('/categorias');
                
                // Axios retorna o corpo em response.data
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
            {/* Outros grupos de filtro aqui */}
        </aside>
    );
};

export default Sidebar;