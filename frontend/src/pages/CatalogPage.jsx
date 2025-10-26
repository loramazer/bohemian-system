// frontend/src/pages/CatalogPage.jsx
// (Código Corrigido)

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Catalog/Sidebar';
import ProductGrid from '../components/Catalog/ProductGrid';
import Pagination from '../components/Shared/Pagination'; 
import { getProducts, getCategories } from '../api';
import '../styles/CatalogPage.css';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const query = useQuery();
  const navigate = useNavigate();
  const location = useLocation();
  
  const PRODUCTS_PER_PAGE = 9;

  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(location.search);
    const catsFromUrl = params.get('categories'); 
    
    return {
      categories: catsFromUrl 
         ? catsFromUrl.split(',').map(Number).filter(id => !isNaN(id)) 
         : [],
      sort: params.get('sort') || 'name_asc',
      price: parseInt(params.get('price'), 10) || 500,
      search: params.get('search') || '',
    };
  });
  
  const [currentPage, setCurrentPage] = useState(() => {
    return parseInt(query.get('page'), 10) || 1;
  });
  
  // --- MUDANÇA 1: Adicionar estado para totalProducts ---
  const [totalPages, setTotalPages] = useState(0); // (Manter para a lógica 'if')
  const [totalProducts, setTotalProducts] = useState(0); // (NOVO)

  // Buscar categorias (apenas uma vez)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
      }
    };
    fetchCategories();
  }, []);

  // Buscar produtos (quando filtros ou página mudam)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          page: currentPage,
          limit: PRODUCTS_PER_PAGE,
          categories: filters.categories.join(','), 
          sort: filters.sort,
          maxPrice: filters.price,
          search: filters.search,
        };

        Object.keys(params).forEach(key => {
          if (!params[key]) {
            delete params[key];
          }
        });
        
        const searchParams = new URLSearchParams();
        if (params.page > 1) searchParams.set('page', String(params.page));
        if (params.categories) searchParams.set('categories', params.categories); 
        if (params.sort && params.sort !== 'name_asc') searchParams.set('sort', params.sort);
        if (params.maxPrice && params.maxPrice !== 500) searchParams.set('price', String(params.maxPrice));
        if (params.search) searchParams.set('search', params.search);
        
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });

        const data = await getProducts(params);
        
        setProducts(data.products || []);
        // --- MUDANÇA 2: Armazenar os dois valores ---
        setTotalPages(data.pages || 0);
        setTotalProducts(data.totalProducts || 0); // (NOVO)
        
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError('Erro ao carregar produtos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, currentPage, navigate, location.pathname]); 

  const handleApplyFilters = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters, 
      categories: newFilters.categories,
      sort: newFilters.sort,
      price: newFilters.price,
    }));
    setCurrentPage(1); 
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); 
  };
  
  useEffect(() => {
     const searchTerm = query.get('search') || '';
     if (searchTerm !== filters.search) {
       setFilters(prev => ({ ...prev, search: searchTerm }));
       setCurrentPage(1);
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]); 

  return (
    <div className="catalog-page">
      <Sidebar
        categories={categories}
        onApplyFilters={handleApplyFilters}
        initialFilters={{ 
          categories: filters.categories,
          sort: filters.sort,
          price: filters.price
        }}
      />
      <main className="catalog-main">
        {loading && <div className="loader">Carregando...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && (
          <>
            <ProductGrid products={products} />
            
            {/* --- MUDANÇA 3: Passar as props corretas --- */}
            {products.length > 0 && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalItems={totalProducts}       // <-- USAR ISTO
                itemsPerPage={PRODUCTS_PER_PAGE} // <-- USAR ISTO
                onPageChange={handlePageChange}
                // totalPages={totalPages} (REMOVIDO)
              />
            )}
            
            {products.length === 0 && (
              <div className="no-products-found">
                Nenhum produto encontrado com os filtros selecionados.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default CatalogPage;