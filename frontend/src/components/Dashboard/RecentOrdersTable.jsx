// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/components/Dashboard/RecentOrdersTable.jsx

import React, { useState } from 'react';
import '../../styles/Dashboard.css';

const RecentOrdersTable = ({ orders, onSelectOrder }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Mapeamento de status do PEDIDO (Logístico)
  const orderStatusLogisticoMap = {
    'in_process': 'Em Preparação', 
    'pending': 'Pendente', 
    'cancelled': 'Cancelado', 
    'authorized': 'Enviado', 
    'delivered': 'Entregue'  
  };

  const mapStatusToLabel = (status) => {
    if (!status) {
      return 'N/A';
    }
    const lowerStatus = status.toLowerCase();
    return orderStatusLogisticoMap[lowerStatus] || lowerStatus.charAt(0).toUpperCase() + lowerStatus.slice(1);
  };
  
  // Função para formatação de moeda
  const formatCurrency = (value) => {
    // Garante que o valor é um número antes de formatar
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return 'R$ 0,00';
    
    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleCheckboxChange = (orderId, order) => {
    if (selectedOrderId === orderId) {
      setSelectedOrderId(null);
    } else {
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
          <tr>
            <th></th>
            <th>Produto</th>
            <th>ID do Pedido</th>
            <th>Data</th>
            <th>Cliente</th>
            <th>Status</th> {/* Agora é Status do Pedido (Logístico) */}
            <th>Valor</th> {/* Agora é Valor Total (com frete) */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>
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
                {/* Status é agora o status_pedido, e a classe usa o status em minúsculo */}
                <span className={`status-badge status-${order.status.toLowerCase()}`}>
                  {mapStatusToLabel(order.status)}
                </span>
              </td>
              {/* Usa a formatação robusta */}
              <td>{formatCurrency(order.valor_total_pedido)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrdersTable;