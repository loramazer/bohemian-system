import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ContentWrapper from '../components/ContentWrapper.jsx';
import OrderInfoCards from '../components/Admin/OrderInfoCards.jsx';
import OrderProductsTable from '../components/Admin/OrderProductsTable.jsx';
import OrderSummary from '../components/Admin/OrderSummary.jsx';

import '../styles/OrderDetail.css';

const orderData = {
    id: '#6743',
    date: 'Mai 31, 2025',
    status: 'Aprovado',
    client: {
        name: 'Shirley Singh',
        email: 'shirley@gmail.com',
        phone: '+91 904 231 1212',
        address: 'Dharam Colony',
        city: 'Gurgaon, Haryana',
        zip: '000000',
    },
    paymentInfo: {
        method: 'Master Card **** **** 6557',
        name: 'Shirley Singh',
        phone: '+91 904 231 1212',
    },
    shippingInfo: {
        method: 'Next express',
        status: 'Pending',
        payment: 'Paypal',
    },
    products: [
        { id: 1, name: 'Lorem Ipsum', idProduto: '#25421', quantity: 2, total: 300, image: 'https://via.placeholder.com/60x60' },
        { id: 2, name: 'Lorem Ipsum', idProduto: '#25421', quantity: 2, total: 300, image: 'https://via.placeholder.com/60x60' },
        { id: 3, name: 'Lorem Ipsum', idProduto: '#25421', quantity: 2, total: 300, image: 'https://via.placeholder.com/60x60' },
        { id: 4, name: 'Lorem Ipsum', idProduto: '#25421', quantity: 2, total: 300, image: 'https://via.placeholder.com/60x60' },
    ],
    prices: {
        subtotal: 1200,
        tax: 240,
        discount: 20,
        shipping: 50,
        total: 1470,
    }
};

const OrderDetailPage = () => {
    const { orderId } = useParams();

    return (
        <ContentWrapper>
            <main className="order-detail-main">
                <div className="admin-breadcrumbs">
                    <Link to="/">Home</Link> &gt; <Link to="/dashboard">Painel</Link> &gt; <Link to="/admin/orders">Pedidos</Link> &gt; <span>Detalhe do Pedido</span>
                </div>
                <div className="order-detail-header">
                    <h2>Pedido ID: {orderId}</h2>
                    <div className="order-actions">
                        <span className="order-status-badge">{orderData.status}</span>
                        <select>
                            <option>Selecione Status</option>
                            <option>Aprovado</option>
                            <option>Pendente</option>
                        </select>
                        <button className="save-btn">Salvar</button>
                    </div>
                </div>
                <OrderInfoCards order={orderData} />
                <div className="products-summary-section">
                    <OrderProductsTable products={orderData.products} />
                    <OrderSummary prices={orderData.prices} />
                </div>
            </main>
        </ContentWrapper>
    );
};

export default OrderDetailPage;