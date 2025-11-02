// frontend/src/pages/OrderDetailPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import OrderInfoCards from '../components/Admin/OrderInfoCards.jsx';
import OrderProductsTable from '../components/Admin/OrderProductsTable.jsx';
import OrderSummary from '../components/Admin/OrderSummary.jsx';
import apiClient from '../api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { FeedbackContext } from '../context/FeedbackContext.jsx';

import '../styles/OrderDetail.css';

// Mapeamento de status (igual ao de AllOrdersPage)
const statusMap = {
    'pending': 'Pendente',
    'approved': 'Aprovado',
    'in_process': 'Em Processamento',
    'authorized': 'Enviado',      // Alterado de 'Autorizado'
    'delivered': 'Entregue',     // Adicionado
    'cancelled': 'Cancelado'
    // 'rejected' e 'failure' removidos
};
const statusOptions = Object.keys(statusMap);

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useContext(AuthContext);
    const { showToast } = useContext(FeedbackContext);

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStatus, setCurrentStatus] = useState('');

    // Hook de segurança e busca de dados
    useEffect(() => {
        if (authLoading) return;
        if (!user || user.admin !== 1) {
            navigate('/');
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/dashboard/orders/${orderId}`);
                setOrder(response.data);
                setCurrentStatus(response.data.status); // Define o status atual
            } catch (error) {
                console.error('Erro ao buscar detalhes do pedido:', error);
                showToast('Erro ao carregar pedido.', 'warning');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrderDetails();
        }
    }, [orderId, user, authLoading, navigate, showToast]);

    // Lida com a mudança no <select>
    const handleStatusSelectChange = (e) => {
        setCurrentStatus(e.target.value);
    };

    // Lida com o clique no botão "Salvar"
    const handleStatusSave = async () => {
        try {
            await apiClient.put(`/dashboard/orders/status/${orderId}`, { status: currentStatus });
            // Atualiza o status no objeto local para refletir a mudança
            setOrder(prevOrder => ({ ...prevOrder, status: currentStatus }));
            showToast('Status atualizado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar status:', error);
            showToast('Falha ao salvar status.', 'warning');
        }
    };
    
    // Função para formatar o status (baseado na sua UserOrderPage)
    const formatStatus = (status) => {
        if (!status) return 'Indefinido';
        return statusMap[status.toLowerCase()] || status;
    };

    // Exibe "Carregando..." enquanto busca os dados
    if (loading || authLoading) {
        return <ContentWrapper><div>Carregando detalhes do pedido...</div></ContentWrapper>;
    }

    // Exibe se o pedido não for encontrado
    if (!order) {
        return <ContentWrapper><div>Pedido não encontrado.</div></ContentWrapper>;
    }

    // Renderiza a página com os dados reais
    return (
        <ContentWrapper>
            <main className="order-detail-main">
                <div className="order-detail-header">
                    
                    {/* --- CORREÇÃO DE LAYOUT (Task 1) --- 
                       Colocado o ID dentro do H2 para ficar lado a lado */}
                    <h2>Pedido ID: {order.id}</h2>

                    <div className="order-actions">
                        <span className={`order-status-badge status-${order.status}`}>
                            {formatStatus(order.status)}
                        </span>
                        <select value={currentStatus} onChange={handleStatusSelectChange}>
                            <option value="">Mudar Status</option>
                            {statusOptions.map(status => (
                                <option key={status} value={status}>{formatStatus(status)}</option>
                            ))}
                        </select>
                        <button className="save-btn" onClick={handleStatusSave}>Salvar</button>
                    </div>
                </div>
                
                {/* Os componentes filhos agora recebem os dados reais da API */}
                <OrderInfoCards order={order} />
                
                <div className="products-summary-section">
                    <OrderProductsTable products={order.products} />
                    <OrderSummary prices={order.prices} />
                </div>
            </main>
        </ContentWrapper>
    );
};

export default OrderDetailPage;