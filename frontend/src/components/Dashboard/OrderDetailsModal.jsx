import React from 'react';
import '../../styles/OrderDetailsModal.css';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) {
    return null;
  }

  const totalValue = order.itens.reduce((sum, item) => sum + (parseFloat(item.precoUnitario) * item.quantidade), 0);

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Detalhes do Pedido #{order.id_pedido}</h2>
        <div className="details-section">
          <h3>Informações do Cliente</h3>
          <p><strong>Nome:</strong> {order.cliente}</p>
          <p><strong>Email:</strong> {order.email_cliente}</p>
        </div>

        <div className="details-section">
          <h3>Dados do Pedido</h3>
          <p><strong>Data do Pedido:</strong> {new Date(order.dataPedido).toLocaleDateString()}</p>
          <p><strong>Data de Entrega:</strong> {new Date(order.data_entrega).toLocaleDateString()}</p>
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