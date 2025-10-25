import React from 'react';
import '../../styles/OrderDetailsModal.css';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) {
    return null;
  }

  const totalValue = order.itens.reduce((sum, item) => sum + (parseFloat(item.precoUnitario) * item.quantidade), 0);

  // Função utilitária para formatar datas, tratando null/inválido
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString();
    } catch (e) {
        return 'Data Inválida';
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Detalhes do Pedido #{order.id_pedido}</h2>
        <div className="details-section">
          <h3>Informações do Cliente</h3>
          {/* CORREÇÃO: Usa os campos 'cliente' e 'email_cliente' diretamente */}
          <p><strong>Nome:</strong> {order.cliente || 'N/A'}</p>
          <p><strong>Email:</strong> {order.email_cliente || 'N/A'}</p>
        </div>

        <div className="details-section">
          <h3>Dados do Pedido</h3>
          {/* CORREÇÃO: Usa a função formatDate */}
          <p><strong>Data do Pedido:</strong> {formatDate(order.dataPedido)}</p>
          <p><strong>Data de Entrega:</strong> {formatDate(order.data_entrega)}</p>
          <p><strong>Forma de Pagamento:</strong> {order.forma_pagamento}</p>
          <p><strong>Status do Pagamento:</strong> {order.status_pagamento}</p>
          <p><strong>Valor Total:</strong> {`R$${totalValue.toFixed(2)}`}</p>
        </div>

        <div className="details-section">
          <h3>Itens do Pedido</h3>
          <ul className="items-list">
            {order.itens.map((item, index) => (
              <li key={index}>
                {item.nome_produto} - {item.quantidade}x ({`R$${parseFloat(item.precoUnitario).toFixed(2)}`})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;