// frontend/src/pages/AllOrdersPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import Pagination from '../components/Shared/Pagination.jsx';
import apiClient from '../api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { FeedbackContext } from '../context/FeedbackContext.jsx';
import '../styles/AllOrdersPage.css'; // Estilos que você já possui

// Mapeamento de status para exibição (combine os do MP e os do seu sistema)
const statusMap = {
    'pending': 'Pendente',
    'approved': 'Aprovado',
    'in_process': 'Em Processamento',
    'authorized': 'Enviado',      // Alterado de 'Autorizado'
    'delivered': 'Entregue',     // Adicionado
    'cancelled': 'Cancelado'
    // 'rejected' e 'failure' removidos
};

// Opções para o <select> de filtro e atualização
const statusOptions = Object.keys(statusMap);

const AllOrdersPage = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const { showToast } = useContext(FeedbackContext);
    const navigate = useNavigate();

    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados de Paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalPedidos, setTotalPedidos] = useState(0);

    // Estados de Filtro
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        startDate: '',
        endDate: '',
    });
    
    const [activeFilters, setActiveFilters] = useState(filters);

    // Hook de segurança e busca de dados
    useEffect(() => {
        if (authLoading) return;
        if (!user || user.admin !== 1) {
            navigate('/');
            return;
        }

        const fetchPedidos = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = {
                    page: currentPage,
                    limit: 15, // 15 pedidos por página
                    search: activeFilters.search || null,
                    status: activeFilters.status || null,
                    startDate: activeFilters.startDate || null,
                    endDate: activeFilters.endDate || null,
                };
                
                // Limpa parâmetros nulos
                Object.keys(params).forEach(key => {
                    if (params[key] === null) delete params[key];
                });

                const response = await apiClient.get('/dashboard/orders/all', { params });
                
                setPedidos(response.data.pedidos || []);
                setTotalPages(response.data.totalPages || 0);
                setTotalPedidos(response.data.totalPedidos || 0);

            } catch (err) {
                console.error('Erro ao buscar pedidos:', err);
                showToast('Erro ao carregar pedidos.', 'warning');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.admin === 1) {
            fetchPedidos();
        }
    }, [user, authLoading, navigate, currentPage, activeFilters, showToast]);

    // --- Handlers ---

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        setCurrentPage(1); // Reseta para a página 1
        setActiveFilters(filters); // Aplica os filtros
    };
    
    const handleClearFilters = () => {
        setFilters({ search: '', status: '', startDate: '', endDate: '' });
        setActiveFilters({ search: '', status: '', startDate: '', endDate: '' });
        setCurrentPage(1);
    };

    const handleStatusChange = async (pedidoId, newStatus) => {
        try {
            // Chama a API para atualizar o status
            await apiClient.put(`/dashboard/orders/status/${pedidoId}`, { status: newStatus });
            
            // Atualiza o estado local para refletir a mudança imediatamente
            setPedidos(prevPedidos =>
                prevPedidos.map(pedido =>
                    pedido.id_pedido === pedidoId
                        ? { ...pedido, status: newStatus }
                        : pedido
                )
            );
            showToast('Status do pedido atualizado!', 'success');
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            showToast('Falha ao atualizar status.', 'warning');
        }
    };

    // Função para formatar o valor
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    // Função para formatar o status (baseado na sua UserOrderPage)
    const formatStatus = (status) => {
        return statusMap[status.toLowerCase()] || status;
    };


    if (loading && pedidos.length === 0) {
        return <ContentWrapper><div>Carregando pedidos...</div></ContentWrapper>;
    }

    return (
        <ContentWrapper>
            <main className="all-orders-main">
                
                <div className="admin-page-header">
                    <h2 className="admin-page-title">Todos os Pedidos ({totalPedidos})</h2>
                </div>

                {/* --- Barra de Filtros --- */}
                <div className="orders-filter-bar">
                    <input
                        type="text"
                        name="search"
                        placeholder="Buscar por nome do cliente..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="filter-input"
                    />
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="filter-select"
                    >
                        <option value="">Todos os Status</option>
                        {statusOptions.map(status => (
                            <option key={status} value={status}>{formatStatus(status)}</option>
                        ))}
                    </select>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className="filter-input"
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="filter-input"
                    />
                    <button onClick={handleApplyFilters} className="filter-btn primary">Filtrar</button>
                    <button onClick={handleClearFilters} className="filter-btn secondary">Limpar</button>
                </div>
                
                {/* --- Tabela de Pedidos --- */}
                <div className="orders-table-container">
                    {loading && <p>Atualizando...</p>}
                    {error && <p className="error-message">{error}</p>}
                    
                    {!loading && pedidos.length === 0 && (
                        <p>Nenhum pedido encontrado com os filtros atuais.</p>
                    )}

                    {pedidos.length > 0 && (
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Pedido ID</th>
                                    <th>Cliente</th>
                                    <th>Data</th>
                                    <th>Total</th>
                                    <th>Status (Pagamento)</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map((pedido) => (
                                    <tr key={pedido.id_pedido}>
                                        <td>
                                            <Link to={`/admin/orders/${pedido.id_pedido}`}>
                                                #{pedido.id_pedido}
                                            </Link>
                                        </td>
                                        <td>{pedido.cliente_nome}</td>
                                        <td>{new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}</td>
                                        <td>{formatCurrency(pedido.total_pedido)}</td>
                                        <td>
                                            {/* Select para atualização de status */}
                                            <select
                                                className={`status-select status-${pedido.status}`}
                                                value={pedido.status}
                                                onChange={(e) => handleStatusChange(pedido.id_pedido, e.target.value)}
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status}>
                                                        {formatStatus(status)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <Link to={`/admin/orders/${pedido.id_pedido}`} className="action-view-btn">
                                                Ver
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* --- Paginação --- */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalPedidos}
                        itemsPerPage={15}
                        onPageChange={handlePageChange}
                    />
                )}
            </main>
        </ContentWrapper>
    );
};

export default AllOrdersPage;