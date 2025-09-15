import React, { useState, useEffect } from 'react';
import '../../styles/Sidebar.css';

const Sidebar = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/categorias');
                if (!response.ok) {
                    throw new Error('Erro ao buscar categorias');
                }
                const data = await response.json();
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