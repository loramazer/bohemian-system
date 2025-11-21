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
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);

    // 1 = Ativos, 0 = Inativos
    const [statusFilter, setStatusFilter] = useState(1); 

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/api/produtos', {
                params: {
                    page: currentPage,
                    limit: ADMIN_PRODUCTS_PER_PAGE,
                    ativo: statusFilter
                }
            });
            
            const data = response.data;
            setProducts(data.products || []);
            setTotalPages(data.pages || 0);
            setTotalProducts(data.totalProducts || 0);

        } catch (err) {
            console.error('Erro ao buscar produtos:', err);
            setError('Erro ao carregar produtos.');
            showToast('Erro ao carregar produtos.', 'warning');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && (!user || user.admin !== 1)) {
            navigate('/');
            return;
        }
        if (!authLoading && user) {
            fetchProducts();
        }
    }, [user, authLoading, navigate, currentPage, statusFilter]);

    const handleToggleStatus = async (product) => {
        try {
            await apiClient.patch(`/api/produtos/${product.id_produto}/status`);
            showToast(`Produto ${product.ativo ? 'desativado' : 'ativado'} com sucesso!`, 'success');
            fetchProducts(); // Recarrega a lista
        } catch (err) {
            console.error('Erro ao alterar status:', err);
            showToast('Erro ao alterar status.', 'error');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleEdit = (productId) => {
        navigate(`/admin/products/edit/${productId}`);
    };

    const handleDeleteRequest = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await apiClient.delete(`/api/produtos/${productToDelete.id_produto}`);
            showToast('Produto removido com sucesso!', 'trash-removed');
            fetchProducts();
        } catch (err) {
            console.error('Erro ao deletar produto:', err);
            showToast('Erro ao remover produto.', 'warning');
        } finally {
            handleCancelDelete();
        }
    };

    if (loading && products.length === 0) return <ContentWrapper><div>Carregando...</div></ContentWrapper>;

    return (
        <ContentWrapper>
            {showDeleteModal && (
                <ConfirmationModal
                    title="Excluir Produto"
                    message={`Tem certeza que deseja excluir "${productToDelete?.nome}"?`}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    confirmText="Sim, Excluir"
                />
            )}

            <div className="admin-products-main">
                <div className="admin-page-header">
                    <h2 className="admin-page-title">Gerenciar Produtos ({totalProducts})</h2>
                    <Link to="/admin/products/add" className="add-product-btn">Adicionar Produto</Link>
                </div>

                {/* --- SWITCH DE FILTRO DA PÁGINA --- */}
                <div className="filter-switch-container">
                    <span 
                        className={`switch-label ${statusFilter === 1 ? 'active' : ''}`}
                        onClick={() => setStatusFilter(1)} // Clicar no texto também ativa
                    >
                        Ativos
                    </span>
                    
                    <label className="page-switch">
                        <input 
                            type="checkbox" 
                            checked={statusFilter === 0} // Marcado = Inativos (0)
                            onChange={() => {
                                setStatusFilter(prev => prev === 1 ? 0 : 1);
                                setCurrentPage(1);
                            }}
                        />
                        <span className="page-slider round"></span>
                    </label>
                    
                    <span 
                        className={`switch-label ${statusFilter === 0 ? 'active' : ''}`}
                        onClick={() => setStatusFilter(0)}
                    >
                        Ocultos
                    </span>
                </div>
                {/* ---------------------------------- */}

                {error && <div className="error-message">{error}</div>}
                
                {!loading && (
                    <AdminProductGrid 
                        products={products}
                        onEdit={handleEdit}
                        onDelete={handleDeleteRequest}
                        onToggleStatus={handleToggleStatus}
                    />
                )}

                {products.length === 0 && <p className="empty-state">Nenhum produto encontrado nesta visualização.</p>}

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalProducts}
                        itemsPerPage={ADMIN_PRODUCTS_PER_PAGE}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </ContentWrapper>
    );
};

export default AllProductsPage;