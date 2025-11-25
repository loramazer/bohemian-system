import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import OrderInfoCards from '../components/Admin/OrderInfoCards.jsx';
import OrderProductsTable from '../components/Admin/OrderProductsTable.jsx';
import OrderSummary from '../components/Admin/OrderSummary.jsx';
import apiClient from '../api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { FeedbackContext } from '../context/FeedbackContext.jsx';

import '../styles/OrderDetail.css';

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

const orderStatusOptions = Object.keys(orderStatusLogisticoMap);

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useContext(AuthContext);
    const { showToast } = useContext(FeedbackContext);

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStatusLogistico, setCurrentStatusLogistico] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');

    useEffect(() => {
        if (authLoading) return;
        if (!user || user.admin !== 1) {
            navigate('/');
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/api/dashboard/orders/${orderId}`);
                const data = response.data;

                setOrder(data);
                setCurrentStatusLogistico(data.status_pedido || 'pending');

                if (data.data_entrega) {
                    const cleanDate = String(data.data_entrega).split('T')[0];
                    setDeliveryDate(cleanDate);
                }

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

    const handleStatusSelectChange = (e) => {
        setCurrentStatusLogistico(e.target.value);
    };

    const handleDateChange = (e) => {
        setDeliveryDate(e.target.value);
    };

    const handleStatusSave = async () => {
        if (!isEditable) {
            showToast('A edição do pedido só é permitida após a aprovação do pagamento.', 'warning');
            return;
        }

        try {
            await apiClient.put(`/api/dashboard/orders/status/${orderId}`, {
                status: currentStatusLogistico,
                deliveryDate: deliveryDate
            });

            setOrder(prevOrder => ({
                ...prevOrder,
                status_pedido: currentStatusLogistico,
                data_entrega: deliveryDate
            }));

            showToast('Dados logísticos atualizados com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar status:', error);
            showToast('Falha ao salvar status logístico.', 'warning');
        }
    };

    const formatLogisticStatus = (status) => {
        if (!status) return 'Indefinido';
        return orderStatusLogisticoMap[status] || status;
    };

    const getLogisticStatusClass = (status) => {
        if (!status) return 'indefinido';
        return status.toLowerCase();
    };

    const isEditable = order && order.status === 'approved';

    if (loading || authLoading) {
        return <ContentWrapper><div>Carregando detalhes do pedido...</div></ContentWrapper>;
    }

    if (!order) {
        return <ContentWrapper><div>Pedido não encontrado.</div></ContentWrapper>;
    }

    return (
        <ContentWrapper>
            <main className="order-detail-main">
                <div className="order-detail-header">

                    <h2>Pedido ID: {order.id}</h2>

                    <div className="order-actions">

                        <div className="action-group" style={{ marginRight: '10px' }}>
                            <input
                                type="date"
                                className="date-input"
                                value={deliveryDate}
                                onChange={handleDateChange}
                                disabled={!isEditable}
                                title="Data de Entrega / Previsão"
                                style={{
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    height: '42px',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <select
                            value={currentStatusLogistico}
                            onChange={handleStatusSelectChange}
                            className={`status-select status-${getLogisticStatusClass(currentStatusLogistico)}`}
                            disabled={!isEditable}
                        >
                            <option value="">Mudar Status</option>
                            {orderStatusOptions.map(status => (
                                <option key={status} value={status}>
                                    {formatLogisticStatus(status)}
                                </option>
                            ))}
                        </select>

                        <button
                            className="save-btn"
                            onClick={handleStatusSave}
                            disabled={!isEditable}
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