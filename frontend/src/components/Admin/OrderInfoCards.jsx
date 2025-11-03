import React from 'react';
import '../../styles/OrderDetail.css';
import { FaUser, FaInfoCircle, FaMapMarkerAlt } from 'react-icons/fa';

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

// Função para formatar o status de PAGAMENTO (para o badge)
const formatPaymentStatus = (status) => {
    if (!status) return 'Indefinido';
    return paymentStatusMap[status.toLowerCase()] || status;
};


const OrderInfoCards = ({ order }) => {
    return (
        <div className="info-cards-grid">
            <div className="info-card">
                <FaUser />
                <div className="card-content">
                    <h4>Cliente</h4>
                    {/* --- Textos traduzidos --- */}
                    <p>Nome: {order.client.name}</p>
                    <p>Email: {order.client.email}</p>
                    <p>Telefone: {order.client.phone}</p>
                </div>
                {/* --- Botão removido (Task 2) --- */}
            </div>
            <div className="info-card">
                <FaInfoCircle />
                <div className="card-content">
                    <h4>Pagamento</h4> {/* Título atualizado para Pagamento */}
                    {/* Informações traduzidas e reorganizadas */}
                    <p>Método: {order.shippingInfo.payment || 'N/A'}</p>
                    <p>Status: {formatPaymentStatus(order.shippingInfo.status)}</p>
                    <p>Cliente Pagador: {order.client.name}</p>
                </div>
                {/* --- Botão removido (Task 2) --- */}
            </div>
            <div className="info-card">
                <FaMapMarkerAlt />
                <div className="card-content">
                    <h4>Endereço</h4>
                    {/* --- Textos traduzidos --- */}
                    <p>Endereço: {order.client.address}</p>
                    <p>Cidade: {order.client.city}</p>
                    <p>CEP: {order.client.zip}</p>
                </div>
                {/* --- Botão removido (Task 2) --- */}
            </div>
        </div>
    );
};

export default OrderInfoCards;