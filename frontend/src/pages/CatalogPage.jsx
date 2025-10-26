// frontend/src/pages/CatalogPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Catalog/Sidebar';
import ProductGrid from '../components/Catalog/ProductGrid';
import Pagination from '../components/Shared/Pagination';
// CORREÇÃO: Importar getProducts e getCategories do api.js
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

  // ATUALIZADO: Incluir 'search' no estado inicial dos filtros lido da URL
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(location.search);
    const catsFromUrl = params.get('categories');
    const searchFromUrl = params.get('search'); // NOVO: Ler busca da URL

    return {
      categories: catsFromUrl
         ? catsFromUrl.split(',').map(Number).filter(id => !isNaN(id))
         : [],
      sort: params.get('sort') || 'name_asc',
      price: parseInt(params.get('price'), 10) || 500,
      search: searchFromUrl || '', // NOVO: Adicionar busca ao estado
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
        // CORREÇÃO: Usar a função importada
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
      }
    };
    fetchCategories();
  }, []);

  // Buscar produtos (ATUALIZADO)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Monta os parâmetros incluindo a busca
        const params = {
          page: currentPage,
          limit: PRODUCTS_PER_PAGE,
          categories: filters.categories.join(','),
          sort: filters.sort,
          maxPrice: filters.price,
          search: filters.search, // NOVO: Incluir busca nos parâmetros da API
        };

        // Remove parâmetros vazios ou padrão antes de chamar a API
        Object.keys(params).forEach(key => {
          if (!params[key] || (key === 'sort' && params[key] === 'name_asc') || (key === 'maxPrice' && params[key] === 500)) {
            if(key !== 'search' || !params[key]) { // Não remove 'search' se estiver vazio intencionalmente
             delete params[key];
            }
          }
        });

         // Atualiza a URL com os parâmetros atuais (incluindo busca)
        const searchParams = new URLSearchParams();
        if (params.page > 1) searchParams.set('page', String(params.page));
        if (params.categories) searchParams.set('categories', params.categories);
        if (params.sort) searchParams.set('sort', params.sort); // Sempre inclui sort se não for o padrão
        if (params.maxPrice) searchParams.set('price', String(params.maxPrice)); // Sempre inclui price se não for o padrão
        if (params.search) searchParams.set('search', params.search); // NOVO: Adiciona busca à URL

        // Navega para a URL atualizada (replace evita adicionar ao histórico)
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });

        // CORREÇÃO: Usar a função importada com os parâmetros
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
    // ATUALIZADO: Adiciona filters.search às dependências
  }, [filters, currentPage, navigate, location.pathname]);

  // Função para aplicar filtros do Sidebar (inalterada, mas agora inclui search indiretamente via estado 'filters')
  const handleApplyFilters = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters, // Mantém a busca atual
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

  // NOVO: useEffect para ouvir mudanças no parâmetro 'search' da URL (vindo do Header)
   useEffect(() => {
     const searchTermFromUrl = query.get('search') || '';
     // Atualiza o estado 'filters' APENAS se o search da URL for diferente do estado atual
     if (searchTermFromUrl !== filters.search) {
       setFilters(prev => ({ ...prev, search: searchTermFromUrl }));
       setCurrentPage(1); // Reseta para a primeira página na nova busca
     }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [location.search]); // Ouve mudanças na query string completa

   
 return (
    // NOVO: Container principal para a página, centralizado
    <div className="catalog-page-container">
        {/* Breadcrumbs aqui, antes da área de conteúdo principal */}
        <div className="catalog-breadcrumbs">
            <Link to="/">Home</Link> &gt; <span>Comprar</span>
        </div>

        {/* NOVO: Div para agrupar Sidebar e Main Content */}
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
                {/* O conteúdo do main permanece o mesmo */}
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