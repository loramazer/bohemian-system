// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/pages/AllProductsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import AdminProductGrid from '../components/Admin/AdminProductGrid.jsx';
import Pagination from '../components/Shared/Pagination.jsx';
import ConfirmationModal from '../components/Shared/ConfirmationModal.jsx';
import { getProducts } from '../api.js'; 
import apiClient from '../api.js'; 
import { FeedbackContext } from '../context/FeedbackContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

// Importa os estilos
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

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Hook para buscar os produtos
    useEffect(() => {
        if (!authLoading && (!user || user.admin !== 1)) {
            navigate('/');
            return;
        }

        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getProducts({
                    page: currentPage,
                    limit: ADMIN_PRODUCTS_PER_PAGE,
                });
                
                setProducts(data.products || []);
                setTotalPages(data.pages || 0);
                setTotalProducts(data.totalProducts || 0);

            } catch (err) {
                console.error('Erro ao buscar produtos:', err);
                setError('Erro ao carregar produtos. Tente novamente.');
                showToast('Erro ao carregar produtos.', 'warning');
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user) {
            fetchProducts();
        }
    }, [user, authLoading, navigate, currentPage, showToast]);

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

    // 3. Confirma a exclusão
    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        try {
            // --- CORREÇÃO AQUI ---
            // Removemos o prefixo /api/ da chamada
            // ANTES: await apiClient.delete(`/api/produtos/${productToDelete.id_produto}`);
            // DEPOIS:
            await apiClient.delete(`/api/produtos/${productToDelete.id_produto}`);
            
            showToast('Produto removido com sucesso!', 'trash-removed');
            
            // Atualiza a lista de produtos
            setProducts(prev => prev.filter(p => p.id_produto !== productToDelete.id_produto));
            setTotalProducts(prev => prev - 1);

        } catch (err) {
            console.error('Erro ao deletar produto:', err);
            showToast('Erro ao remover produto.', 'warning');
        } finally {
            handleCancelDelete();
        }
    };


    if (loading || authLoading) {
        return <ContentWrapper><div>Carregando...</div></ContentWrapper>;
    }
    
    return (
        <ContentWrapper>
            {showDeleteModal && (
                <ConfirmationModal
                    title="Excluir Produto"
                    message={`Tem certeza que deseja excluir o produto "${productToDelete?.nome}"? Esta ação não pode ser desfeita.`}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    confirmText="Sim, Excluir"
                />
            )}

            {/* ANTES: <main className="admin-products-main"> */}
            <div className="admin-products-main">
                <div className="admin-page-header">
                    <h2 className="admin-page-title">Todos os Produtos ({totalProducts})</h2>
                    <Link to="/admin/products/add" className="add-product-btn">
                        Adicionar Produto
                    </Link>
                </div>

                {error && <div className="error-message">{error}</div>}
                
                {!loading && products.length > 0 && (
                    <AdminProductGrid 
                        products={products}
                        onEdit={handleEdit}
                        onDelete={handleDeleteRequest}
                    />
                )}

                {!loading && products.length === 0 && (
                    <p>Nenhum produto encontrado.</p>
                )}

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalProducts}
                        itemsPerPage={ADMIN_PRODUCTS_PER_PAGE}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
            {/* ANTES: </main> */}
        </ContentWrapper>
    );
};

export default AllProductsPage;