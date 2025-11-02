// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/components/Dashboard/RecentOrdersTable.jsx
import React, { useState } from 'react';
import '../../styles/Dashboard.css';

const RecentOrdersTable = ({ orders, onSelectOrder }) => {
  // ESTADO: Armazena o ID do pedido que está atualmente selecionado
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Mapeia o status do backend para um texto amigável no frontend
  const mapStatusToLabel = (status) => {
    if (!status) {
      return 'N/A';
    }
    switch (status.toLowerCase()) { // Usar toLowerCase para segurança
      case 'approved':
        return 'Aprovado';
      case 'authorized': // Enviado
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
        return 'Desconhecido';
    }
  };

  const handleCheckboxChange = (orderId, order) => {
    // Implementa a lógica MÚTUA EXCLUSIVA
    if (selectedOrderId === orderId) {
      // Se já estiver selecionado, deseleciona (para permitir desmarcar)
      setSelectedOrderId(null);
    } else {
      // Seleciona o novo item e dispara o modal
      setSelectedOrderId(orderId);
      onSelectOrder(order);
    }
  };

  return (
    <div className="recent-orders-container">
      <div className="table-header">
        <h3>Pedidos Recentes</h3>
      </div>
      <table className="orders-table">
        <thead>
          <tr><th></th>{/* Mantém a coluna para o checkbox */}
            <th>Produto</th>
            <th>ID do Pedido</th>
            <th>Data</th>
            <th>Cliente</th>
            <th>Status</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={index}
            >
              <td>
                {/* Checkbox controlado pelo estado, comportando-se como Radio Button visualmente */}
                <input
                  type="checkbox"
                  id={`order-${order.id_pedido}`}
                  checked={selectedOrderId === order.id_pedido}
                  onChange={() => handleCheckboxChange(order.id_pedido, order)}
                />
                <label htmlFor={`order-${order.id_pedido}`}></label>
              </td>
              <td>{order.nome_produtos}</td>
              <td>{order.id_pedido}</td>
              <td>{new Date(order.dataPedido).toLocaleDateString()}</td>
              <td>{order.cliente}</td>
              <td>
                <span className={`status-badge status-${order.status.toLowerCase()}`}>
                  {mapStatusToLabel(order.status)}
                </span>
              </td>
              <td>{`R$${parseFloat(order.valor_total_pedido).toFixed(2)}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrdersTable;