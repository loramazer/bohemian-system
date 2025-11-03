import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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
    const searchFromUrl = params.get('search'); 

    return {
      categories: catsFromUrl
         ? catsFromUrl.split(',').map(Number).filter(id => !isNaN(id))
         : [],
      sort: params.get('sort') || 'name_asc',
      price: parseInt(params.get('price'), 10) || 500,
      search: searchFromUrl || '', 
    };
  });

  const [currentPage, setCurrentPage] = useState(() => {
    return parseInt(query.get('page'), 10) || 1;
  });

  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  // Buscar categorias (inalterado)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();

        const categoriesData = response.data || response;

        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          console.error("Erro: A API getCategories() não retornou um array.", categoriesData);
          setCategories([]); 
        }

      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        setCategories([]); 
      }
    };
    fetchCategories();
  }, []);

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
          if (!params[key] || (key === 'sort' && params[key] === 'name_asc') || (key === 'maxPrice' && params[key] === 500)) {
            if(key !== 'search' || !params[key]) { 
             delete params[key];
            }
          }
        });

        const searchParams = new URLSearchParams();
        if (params.page > 1) searchParams.set('page', String(params.page));
        if (params.categories) searchParams.set('categories', params.categories);
        if (params.sort) searchParams.set('sort', params.sort);
        if (params.maxPrice) searchParams.set('price', String(params.maxPrice)); 
        if (params.search) searchParams.set('search', params.search); 

        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });

        const data = await getProducts(params);

        setProducts(data.products || []);
        setTotalPages(data.pages || 0);
        setTotalProducts(data.totalProducts || 0);

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
     const searchTermFromUrl = query.get('search') || '';
     if (searchTermFromUrl !== filters.search) {
       setFilters(prev => ({ ...prev, search: searchTermFromUrl }));
       setCurrentPage(1); 
     }
   }, [location.search]); 

   
 return (
    <div className="catalog-page-container">
        {}
        <div className="catalog-breadcrumbs">
            <Link to="/">Home</Link> &gt; <span>Comprar</span>
        </div>

        {}
        <div className="catalog-content-area">
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
                {}
                {loading && <div className="loader">Carregando...</div>}
                {error && <div className="error-message">{error}</div>}
                {!loading && !error && (
                <>
                    {filters.search && (
                    <div className="search-results-header">
                        <h3>Resultados para: "{filters.search}"</h3>
                    </div>
                    )}
                    <ProductGrid products={products} />

                    {products.length > 0 && totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalProducts}
                        itemsPerPage={PRODUCTS_PER_PAGE}
                        onPageChange={handlePageChange}
                    />
                    )}

                    {!loading && products.length === 0 && (
                    <div className="no-products-found">
                        {filters.search
                        ? `Nenhum produto encontrado para "${filters.search}".`
                        : 'Nenhum produto encontrado com os filtros selecionados.'}
                    </div>
                    )}
                </>
                )}
            </main>
        </div>
    </div>
  );
}

export default CatalogPage;