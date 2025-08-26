import React from 'react';
import '../../styles/Dashboard.css';

const RecentOrdersTable = ({ orders }) => {
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
            <tr key={index}>
              <td>
                <input type="checkbox" id={`order-${index}`} />
                <label htmlFor={`order-${index}`}></label>
              </td>
              <td>Lorem Ipsum</td>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>{order.client}</td>
              <td><span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span></td>
              <td>{order.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrdersTable;