import React from 'react';
import '../../styles/Dashboard.css';

const RecentOrdersTable = ({ orders, onSelectOrder }) => {
  // Mapeia o status do backend para um texto amigável no frontend
  const mapStatusToLabel = (status) => {
    if (!status) {
      return 'N/A';
    }
    switch (status) {
      case 'approved':
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

  return (
    <div className="recent-orders-container">
      <div className="table-header">
        <h3>Pedidos Recentes</h3>
      </div>
      <table className="orders-table">
        <thead>
          <tr>
            <th></th>
            <th>Produto</th>
            <th>ID Pedido</th>
            <th>Data</th>
            <th>Nome Cliente</th>
            <th>Status</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} onClick={() => onSelectOrder(order)}>
              <td>
                <input type="checkbox" id={`order-${index}`} />
                <label htmlFor={`order-${index}`}></label>
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