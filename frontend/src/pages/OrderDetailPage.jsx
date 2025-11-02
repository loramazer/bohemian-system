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

// Mapeamento de status de PAGAMENTO (apenas para exibição do badge)
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

// Mapeamento de status do PEDIDO (Logístico) - Alinha com os códigos ENUM
const orderStatusLogisticoMap = {
    'in_process': 'Em Preparação', 
    'pending': 'Pendente', 
    'cancelled': 'Cancelado', 
    'authorized': 'Enviado', 
    'delivered': 'Entregue' 
};

// Opções para o select (os códigos ENUM do status logístico)
const orderStatusOptions = Object.keys(orderStatusLogisticoMap);

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useContext(AuthContext);
    const { showToast } = useContext(FeedbackContext);

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    // currentStatusLogistico armazena o código ENUM do status logístico
    const [currentStatusLogistico, setCurrentStatusLogistico] = useState(''); 

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
                // Usa o status LOGÍSTICO (status_pedido) do DB
                setCurrentStatusLogistico(response.data.status_pedido || 'pending'); 
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
        // Recebe o código ENUM do select
        setCurrentStatusLogistico(e.target.value); 
    };

    // Lida com o clique no botão "Salvar"
    const handleStatusSave = async () => {
        // currentStatusLogistico é o código ENUM que será salvo
        try {
            // Usa o endpoint que atualiza o status_pedido
            await apiClient.put(`/dashboard/orders/status/${orderId}`, { status: currentStatusLogistico });
            // Atualiza o status LOGÍSTICO (status_pedido) no objeto local para refletir a mudança
            setOrder(prevOrder => ({ ...prevOrder, status_pedido: currentStatusLogistico }));
            showToast('Status logístico atualizado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar status:', error);
            showToast('Falha ao salvar status logístico.', 'warning');
        }
    };
    
    // Função para formatar o status de PAGAMENTO (para o badge)
    const formatPaymentStatus = (status) => {
        if (!status) return 'Indefinido';
        return paymentStatusMap[status.toLowerCase()] || status;
    };
    
    // Função para formatar o status LOGÍSTICO (para o select e exibição)
    const formatLogisticStatus = (status) => {
        if (!status) return 'Indefinido';
        // Procura o texto de exibição pelo código ENUM/DB
        return orderStatusLogisticoMap[status] || status;
    };
    
    // Função para mapear status logístico para classes CSS (usa as classes de pagamento)
    const getLogisticStatusClass = (status) => {
        if (!status) return 'indefinido';
        return status.toLowerCase();
    };


    if (loading || authLoading) {
        return <ContentWrapper><div>Carregando detalhes do pedido...</div></ContentWrapper>;
    }

    if (!order) {
        return <ContentWrapper><div>Pedido não encontrado.</div></ContentWrapper>;
    }

    // Renderiza a página com os dados reais
    return (
        <ContentWrapper>
            <main className="order-detail-main">
                <div className="order-detail-header">
                    
                    <h2>Pedido ID: {order.id}</h2>

                    <div className="order-actions">
                        
                        {/* BADGE DE STATUS DE PAGAMENTO (order.status) */}
                        <span className={`order-status-badge status-${order.status}`}>
                            {formatPaymentStatus(order.status)}
                        </span>

                        {/* SELECT: Permite mudar o status LOGÍSTICO */}
                        <select 
                            value={currentStatusLogistico} 
                            onChange={handleStatusSelectChange}
                            className={`status-select status-${getLogisticStatusClass(currentStatusLogistico)}`} 
                        >
                            <option value="">Mudar Status Logístico</option>
                            {orderStatusOptions.map(status => (
                                // value é o código ENUM (ex: 'authorized')
                                <option key={status} value={status}>
                                    {formatLogisticStatus(status)}
                                </option>
                            ))}
                        </select>
                        
                        <button 
                            className="save-btn" 
                            onClick={handleStatusSave}
                            // Desabilita se o status selecionado for o mesmo do atual
                            disabled={currentStatusLogistico === order.status_pedido}
                        >
                            Salvar
                        </button>
                    </div>
                </div>
                
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