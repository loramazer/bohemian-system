import React from 'react';
import { Link } from 'react-router-dom';
import ContentWrapper from '../components//ContentWrapper.jsx';
import '../styles/AllOrdersPage.css';

const ordersData = [
    { id: '#6743', date: 'Mai 31, 2025', client: 'Shirley Singh', status: 'Aprovado', total: 'R$1.470,00' },
    { id: '#6744', date: 'Mai 30, 2025', client: 'John Doe', status: 'Pendente', total: 'R$2.500,00' },
    { id: '#6745', date: 'Mai 29, 2025', client: 'Jane Smith', status: 'Enviado', total: 'R$800,00' },
    { id: '#6746', date: 'Mai 28, 2025', client: 'Michael Johnson', status: 'Entregue', total: 'R$3.200,00' },
];

const AllOrdersPage = () => {
    return (
        <ContentWrapper>
            <main className="all-orders-main">
                <div className="admin-breadcrumbs">
                    <Link to="/">Home</Link> &gt; <Link to="/dashboard">Painel</Link> &gt; <span>Pedidos</span>
                </div>
                <div className="admin-page-header">
                    <h1 className="admin-page-title">Todos Pedidos</h1>
                </div>
                <div className="orders-table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>ID Pedido</th>
                                <th>Data</th>
                                <th>Cliente</th>
                                <th>Status</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                <tbody>
    {ordersData.map(order => (
        <tr key={order.id}>
            <td>
              
                <Link to={`/admin/orders/${order.id}`}>{order.id}</Link>
            </td>
            <td>{order.date}</td>
            <td>{order.client}</td>
            <td className={`status-${order.status.toLowerCase()}`}>{order.status}</td>
            <td>{order.total}</td>
        </tr>
    ))}
</tbody>
                    </table>
                </div>
            </main>
        </ContentWrapper>
    );
};

export default AllOrdersPage;