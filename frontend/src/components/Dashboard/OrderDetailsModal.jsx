// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/components/Dashboard/OrderDetailsModal.jsx
import React from 'react';
import '../../styles/OrderDetailsModal.css';

// Mapeamento de status para exibição (Texto)
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
        return 'Em Processo';
      case 'rejected':
        return 'Rejeitado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
};

// Mapeamento para Status Logístico (Classe CSS) - MANTIDO, MAS NÃO USADO NO SPAN
const getLogisticStatusClass = (status) => {
    if (!status) return 'desconhecido';
    const s = status.toLowerCase();
    
    // Mapeia o status logístico do DB para a classe CSS do status de pagamento (que tem as cores)
    if (s === 'em preparação') return 'in_process'; // Azul/Amarelo
    if (s === 'pendente') return 'pending';       // Amarelo
    if (s === 'cancelado') return 'cancelled';     // Vermelho
    if (s === 'enviado') return 'authorized';      // Verde
    if (s === 'entregue') return 'approved';      // Verde
    
    return 'desconhecido';
};

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) {
    return null;
  }

  const totalValue = order.prices ? order.prices.total : 0;

  // Função utilitária para formatar datas, tratando null/inválido
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
          
          {/* Status do Pedido (Logístico) - CORRIGIDO: Adicionado espaço */}
          <p><strong>Status do Pedido:</strong>&nbsp;
             <span style={{ fontWeight: 'bold' }}>
                 {order.status_pedido || 'N/A'}
             </span>
          </p>

          {/* Status do Pagamento (Financeiro) - CORRIGIDO: Adicionado espaço */}
          <p><strong>Status do Pagamento:</strong>&nbsp;
             <span style={{ fontWeight: 'bold' }}>
                 {mapStatusToLabel(order.status)}
             </span>
          </p>
          
          <p><strong>Valor Total:</strong> {`R$${totalValue.toFixed(2)}`}</p>
        </div>

        <div className="details-section">
          <h3>Itens do Pedido</h3>
          <ul className="items-list">
            {order.products && order.products.length > 0 ? (
                order.products.map((item, index) => (
                  <li key={item.id || index}>
                    {item.name} - {item.quantity}x ({`R$${parseFloat(item.total).toFixed(2)}`})
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