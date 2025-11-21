import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import Pagination from '../components/Shared/Pagination.jsx';
import apiClient from '../api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { FeedbackContext } from '../context/FeedbackContext.jsx';
import '../styles/AllOrdersPage.css';

const paymentStatusMap = {
    'pending': 'Pendente',
    'approved': 'Aprovado',
    'in_process': 'Em Processamento',
    'authorized': 'Autorizado',
    'delivered': 'Entregue',
    'cancelled': 'Cancelado',
    'rejected': 'Rejeitado',
    'failure': 'Falhou'
};

const orderStatusLogisticoMap = {
    'in_process': 'Em Preparação',
    'pending': 'Pendente',
    'cancelled': 'Cancelado',
    'authorized': 'Enviado',
    'delivered': 'Entregue'
};

const paymentStatusOptions = Object.keys(paymentStatusMap);
const orderStatusOptions = Object.keys(orderStatusLogisticoMap);

const normalizeStatus = (status) => {
    if (!status) return 'pending';
    const s = status.toLowerCase();

    if (s === 'pendente') return 'pending';
    if (s === 'em preparação') return 'in_process';
    if (s === 'cancelado') return 'cancelled';
    if (s === 'enviado') return 'authorized';
    if (s === 'entregue') return 'delivered';

    return s;
};

const AllOrdersPage = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const { showToast } = useContext(FeedbackContext);
    const navigate = useNavigate();

    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalPedidos, setTotalPedidos] = useState(0);

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        startDate: '',
        endDate: '',
    });

    const [activeFilters, setActiveFilters] = useState(filters);

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
                    limit: 15,
                    search: activeFilters.search || null,
                    status: activeFilters.status || null,
                    startDate: activeFilters.startDate || null,
                    endDate: activeFilters.endDate || null,
                };

                Object.keys(params).forEach(key => {
                    if (params[key] === null) delete params[key];
                });

                const response = await apiClient.get('/api/dashboard/orders/all', { params });

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

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        setCurrentPage(1);
        setActiveFilters(filters);
    };

    const handleClearFilters = () => {
        setFilters({ search: '', status: '', startDate: '', endDate: '' });
        setActiveFilters({ search: '', status: '', startDate: '', endDate: '' });
        setCurrentPage(1);
    };

    const handleStatusChange = async (pedidoId, newStatusPedido, currentPaymentStatus) => {
        if (currentPaymentStatus !== 'approved') {
            showToast('A edição do status do pedido só é permitida após a aprovação do pagamento.', 'warning');
            return;
        }

        try {
            await apiClient.put(`/api/dashboard/orders/status/${pedidoId}`, { status: newStatusPedido });

            setPedidos(prevPedidos =>
                prevPedidos.map(pedido =>
                    pedido.id_pedido === pedidoId
                        ? { ...pedido, status_pedido: newStatusPedido }
                        : pedido
                )
            );
            showToast('Status do pedido atualizado!', 'success');
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            const errorMessage = error.response?.data?.message || 'Falha ao atualizar status.';
            showToast(errorMessage, 'warning');
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatPaymentStatus = (status) => {
        return paymentStatusMap[status.toLowerCase()] || status;
    };

    const formatOrderStatus = (status) => {
        return orderStatusLogisticoMap[status] || status;
    };

    const getOrderStatusClass = (status) => {
        if (!status) return 'indefinido';
        return normalizeStatus(status);
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
                        <option value="">Todos os Status (Pedido)</option>
                        {orderStatusOptions.map(status => (
                            <option key={status} value={status}>
                                {formatOrderStatus(status)}
                            </option>
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
                                    <th>Status (Pedido)</th>
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
                                            <span
                                                className={`status-badge status-${pedido.status}`}
                                                style={{ padding: '8px 12px', borderRadius: '5px' }}
                                            >
                                                {formatPaymentStatus(pedido.status)}
                                            </span>
                                        </td>

                                        <td>
                                            <select
                                                className={`status-select status-${getOrderStatusClass(pedido.status_pedido)}`}
                                                value={normalizeStatus(pedido.status_pedido)}
                                                disabled={pedido.status !== 'approved'}
                                                onChange={(e) => handleStatusChange(pedido.id_pedido, e.target.value, pedido.status)}
                                            >
                                                {orderStatusOptions.map(status => (
                                                    <option key={status} value={status}>
                                                        {formatOrderStatus(status)}
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