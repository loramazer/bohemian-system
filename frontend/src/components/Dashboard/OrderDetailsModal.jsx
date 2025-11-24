// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/components/Dashboard/OrderDetailsModal.jsx
import React from 'react';
import '../../styles/OrderDetailsModal.css';

const mapStatusToLabel = (status) => {
    if (!status) return 'N/A';
    switch (status.toLowerCase()) {
      case 'approved':
        return 'Aprovado';
      case 'authorized': 
        return 'Enviado';
      case 'pending':
        return 'Pendente';
      case 'in_process':
        return 'Em Preparação'; 
      case 'rejected':
        return 'Rejeitado';
      case 'cancelled':
        return 'Cancelado';
      case 'delivered':
        return 'Entregue'; 
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
};

const getLogisticStatusClass = (status) => {
    if (!status) return 'desconhecido';
    const s = status.toLowerCase();
    
    if (s === 'em preparação') return 'in_process'; 
    if (s === 'pendente') return 'pending';       
    if (s === 'cancelado') return 'cancelled';     
    if (s === 'enviado') return 'authorized';      
    if (s === 'entregue') return 'approved';      
    
    return 'desconhecido';
};

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) {
    return null;
  }

  const totalValue = order.prices ? order.prices.total : 0;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        if (typeof dateString === 'string' && dateString.includes('-')) {
             return new Date(dateString).toLocaleDateString();
        }
        return dateString;
    } catch (e) {
        return 'Data Inválida';
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Detalhes do Pedido {order.id}</h2>
        <div className="details-section">
          <h3>Informações do Cliente</h3>
          <p><strong>Nome:</strong> {order.client?.name || 'N/A'}</p>
          <p><strong>Email:</strong> {order.client?.email || 'N/A'}</p>
        </div>

        <div className="details-section">
          <h3>Dados do Pedido</h3>
          <p><strong>Data do Pedido:</strong> {formatDate(order.date)}</p>
          <p><strong>Data de Entrega:</strong> {formatDate(order.data_entrega)}</p>
          <p><strong>Forma de Pagamento:</strong> {order.paymentInfo?.method || 'N/A'}</p>
          
        
          <p><strong>Status do Pedido:</strong> {mapStatusToLabel(order.status_pedido)}</p>

          <p><strong>Status do Pagamento:</strong> {mapStatusToLabel(order.status)}</p>
          
          <p><strong>Valor Total:</strong> {`R$${totalValue.toFixed(2).replace('.', ',')}`}</p>
        </div>

        <div className="details-section">
          <h3>Itens do Pedido</h3>
          <ul className="items-list">
            {order.products && order.products.length > 0 ? (
                order.products.map((item, index) => (
                  <li key={item.id || index}>
                    {item.name} - {item.quantity}x ({`R$${parseFloat(item.total).toFixed(2).replace('.', ',')}`})
                  </li>
                ))
            ) : (
                <li>Itens não disponíveis</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;