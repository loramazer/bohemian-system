import React, { useState, useEffect } from 'react';
import '../../styles/Sidebar.css';

// Componente Sidebar.jsx atualizado
function Sidebar({
  categories,
  onApplyFilters, // Prop trocada: de onFilterChange para onApplyFilters
  initialFilters = {} // Props para receber os filtros iniciais da URL/CatalogPage
}) {
  const [localSelectedCategories, setLocalSelectedCategories] = useState(initialFilters.categories || []);
  const [localSortOrder, setLocalSortOrder] = useState(initialFilters.sort || 'name_asc');
  // Usamos 500 como o máximo padrão se não for fornecido
  const [localPriceRange, setLocalPriceRange] = useState(initialFilters.price || 500); 
  const [maxPrice, setMaxPrice] = useState(500); // Define um máximo fixo para o slider

  // Efeito para atualizar o estado local se os filtros iniciais mudarem (ex: navegação)
  useEffect(() => {
    setLocalSelectedCategories(initialFilters.categories || []);
    setLocalSortOrder(initialFilters.sort || 'name_asc');
    setLocalPriceRange(initialFilters.price || 500);
  }, [initialFilters]);


  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value, 10);
    setLocalSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSortChange = (e) => {
    setLocalSortOrder(e.target.value);
  };

  const handlePriceChange = (e) => {
    setLocalPriceRange(parseInt(e.target.value, 10));
  };

  const handleApply = (e) => {
    e.preventDefault();
    onApplyFilters({
      categories: localSelectedCategories,
      sort: localSortOrder,
      price: localPriceRange,
    });
  };

  return (
    <aside className="sidebar">
      <div className="filter-section">
        <h3>Categorias</h3>
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category.id_categoria}>
              <label>
                <input
                  type="checkbox"
                  value={category.id_categoria}
                  checked={localSelectedCategories.includes(category.id_categoria)}
                  onChange={handleCategoryChange}
                />
                {category.nome}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section">
        <h3>Ordenar por</h3>
        <select value={localSortOrder} onChange={handleSortChange}>
          <option value="name_asc">Nome (A-Z)</option>
          <option value="name_desc">Nome (Z-A)</option>
          <option value="price_asc">Preço (Menor)</option>
          <option value="price_desc">Preço (Maior)</option>
        </select>
      </div>

      <div className="filter-section">
        <h3>Filtrar por Preço</h3>
        {/* NOVO: Exibição do valor do preço */}
        <div className="price-display">
          Até: R$ {localPriceRange.toFixed(2)}
        </div>
        <input
          type="range"
          id="price-range"
          min="0"
          max={maxPrice} // Usar o maxPrice
          value={localPriceRange}
          onChange={handlePriceChange}
          className="price-slider"
        />
        <div className="price-range-labels">
          <span>R$ 0</span>
          <span>R$ {maxPrice}</span>
        </div>
      </div>

      {/* Botão funcional */}
      <button onClick={handleApply} className="apply-filters-btn">
        Aplicar
      </button>
    </aside>
  );
}

export default Sidebar;