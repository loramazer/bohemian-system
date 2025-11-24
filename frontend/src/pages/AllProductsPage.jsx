import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import AdminProductGrid from '../components/Admin/AdminProductGrid.jsx';
import Pagination from '../components/Shared/Pagination.jsx';
import ConfirmationModal from '../components/Shared/ConfirmationModal.jsx';
import apiClient from '../api.js'; 
import { FeedbackContext } from '../context/FeedbackContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/AllProductsPage.css';
import '../styles/AdminProductCard.css'; 

const ADMIN_PRODUCTS_PER_PAGE = 12;

const AllProductsPage = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const { showToast } = useContext(FeedbackContext);
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoriesList, setCategoriesList] = useState([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const [appliedFilters, setAppliedFilters] = useState({
        status: 1, // 1=Ativos, 0=Ocultos
        categories: [],
        sort: 'newest',
        maxPrice: 500,
        search: ''
    });

    const [localCategories, setLocalCategories] = useState([]);
    const [localSort, setLocalSort] = useState('newest');
    const [localPrice, setLocalPrice] = useState(500);

    useEffect(() => {
        apiClient.get('/api/categorias')
            .then(res => setCategoriesList(res.data))
            .catch(err => console.error("Erro categorias", err));
    }, []);

    useEffect(() => {
        if (!authLoading && (!user || user.admin !== 1)) {
            navigate('/');
            return;
        }
        if (authLoading || !user) return;

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {
                    page: currentPage,
                    limit: ADMIN_PRODUCTS_PER_PAGE,
                    ativo: appliedFilters.status,
                    search: appliedFilters.search,
                    sort: appliedFilters.sort,
                    categories: appliedFilters.categories.length > 0 ? appliedFilters.categories.join(',') : undefined,
                    maxPrice: appliedFilters.maxPrice
                };

                const response = await apiClient.get('/api/produtos', { params });
                setProducts(response.data.products || []);
                setTotalPages(response.data.pages || 0);
                setTotalProducts(response.data.totalProducts || 0);
            } catch (err) {
                console.error(err);
                showToast('Erro ao carregar produtos.', 'warning');
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(timeoutId);

    }, [user, authLoading, navigate, currentPage, appliedFilters]);

    
    const handleLocalCategoryChange = (e) => {
        const catId = parseInt(e.target.value, 10);
        setLocalCategories(prev => 
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        );
    };

    const handleApplyFilters = () => {
        setCurrentPage(1);
        setAppliedFilters(prev => ({
            ...prev,
            categories: localCategories,
            sort: localSort,
            maxPrice: localPrice
        }));
    };

    const handleStatusChange = (newStatus) => {
        setCurrentPage(1);
        setAppliedFilters(prev => ({ ...prev, status: newStatus }));
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setAppliedFilters(prev => ({ ...prev, search: val }));
    };

    const handleToggleStatus = async (product) => {
        try {
            await apiClient.patch(`/api/produtos/${product.id_produto}/status`);
            showToast(`Produto ${product.ativo ? 'desativado' : 'ativado'} com sucesso!`, 'success');
            setAppliedFilters(prev => ({ ...prev })); 
        } catch (err) { showToast('Erro status', 'error'); }
    };

    const handleEdit = (pid) => navigate(`/admin/products/edit/${pid}`);
    const handleDeleteRequest = (p) => { setProductToDelete(p); setShowDeleteModal(true); };
    const handleConfirmDelete = async () => {
        if(!productToDelete) return;
        try {
            await apiClient.delete(`/api/produtos/${productToDelete.id_produto}`);
            showToast('Removido.', 'trash-removed');
            setAppliedFilters(prev => ({ ...prev })); 
        } catch(e){ showToast('Erro remover', 'error'); }
        finally { setShowDeleteModal(false); setProductToDelete(null); }
    };

    if (loading && products.length === 0 && !appliedFilters.search) return <ContentWrapper><div>Carregando...</div></ContentWrapper>;

    return (
        <ContentWrapper>
            {showDeleteModal && (
                <ConfirmationModal 
                    title="Excluir" message={`Excluir "${productToDelete?.nome}"?`}
                    onConfirm={handleConfirmDelete} onCancel={() => setShowDeleteModal(false)} 
                />
            )}

            <div className="admin-products-main">
                <div className="admin-page-header">
                    <h2 className="admin-page-title">Gerenciar Produtos ({totalProducts})</h2>
                    <Link to="/admin/products/add" className="add-product-btn">Adicionar Produto</Link>
                </div>

                <div className="admin-layout-grid">
                    
                    
                    <aside className="sidebar">
                        
                        <div className="filter-section">
                            <div className="visualizar">
                            <h3>Visualização</h3>
                            </div>
                            <div className="filter-switch-mini">
                                <span className={appliedFilters.status === 1 ? 'active' : ''} onClick={() => handleStatusChange(1)}>Ativos</span>
                                <label className="page-switch">
                                    <input type="checkbox" checked={appliedFilters.status === 0} onChange={() => handleStatusChange(appliedFilters.status === 1 ? 0 : 1)} />
                                    <span className="page-slider round"></span>
                                </label>
                                <span className={appliedFilters.status === 0 ? 'active' : ''} onClick={() => handleStatusChange(0)}>Ocultos</span>
                            </div>
                        </div>

                        <div className="filter-section">
                            <h3>Categorias</h3>
                            <ul className="category-list">
                                {categoriesList.map(cat => (
                                    <li key={cat.id_categoria}>
                                        <label>
                                            <input 
                                                type="checkbox" 
                                                value={cat.id_categoria}
                                                checked={localCategories.includes(cat.id_categoria)}
                                                onChange={handleLocalCategoryChange}
                                            />
                                            {cat.nome}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="filter-section">
                            <h3>Ordenar por</h3>
                            <select value={localSort} onChange={(e) => setLocalSort(e.target.value)}>
                                <option value="newest">Mais Recentes</option>
                                <option value="name_asc">Nome (A-Z)</option>
                                <option value="name_desc">Nome (Z-A)</option>
                                <option value="price_asc">Preço (Menor)</option>
                                <option value="price_desc">Preço (Maior)</option>
                            </select>
                        </div>

                        <div className="filter-section">
                            <h3>Filtrar por Preço</h3>
                            <div className="price-display">
                                Até: R$ {localPrice.toFixed(2)}
                            </div>
                            <input 
                                type="range"
                                min="0" max="2000"
                                value={localPrice}
                                onChange={(e) => setLocalPrice(Number(e.target.value))}
                                className="price-slider"
                            />
                            <div className="price-range-labels">
                                <span>R$ 0</span>
                                <span>R$ 2000</span>
                            </div>
                        </div>

                        <button onClick={handleApplyFilters} className="apply-filters-btn">
                            Aplicar Filtros
                        </button>

                    </aside>

                    <div className="admin-content-area">
                        
                        <div className="admin-top-search">
                            <input 
                                type="text" 
                                placeholder="Buscar produto por nome..." 
                                value={appliedFilters.search}
                                onChange={handleSearchChange}
                                className="search-input-wide"
                            />
                        </div>

                        {!loading && (
                            <AdminProductGrid 
                                products={products}
                                onEdit={handleEdit}
                                onDelete={handleDeleteRequest}
                                onToggleStatus={handleToggleStatus}
                            />
                        )}

                        {products.length === 0 && <div className="empty-state">Nenhum produto encontrado.</div>}

                        {totalPages > 1 && (
                            <Pagination currentPage={currentPage} totalItems={totalProducts} itemsPerPage={ADMIN_PRODUCTS_PER_PAGE} onPageChange={(p) => {setCurrentPage(p); window.scrollTo(0,0);}} />
                        )}
                    </div>
                </div>
            </div>
        </ContentWrapper>
    );
};

export default AllProductsPage;