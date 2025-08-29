import React from 'react';
import '../../styles/OrderDetail.css';
import { FaUser, FaInfoCircle, FaMapMarkerAlt } from 'react-icons/fa';

const OrderInfoCards = ({ order }) => {
    return (
        <div className="info-cards-grid">
            <div className="info-card">
                <FaUser />
                <div className="card-content">
                    <h4>Cliente</h4>
                    <p>Name: {order.client.name}</p>
                    <p>Email: {order.client.email}</p>
                    <p>Phone: {order.client.phone}</p>
                </div>
                <button className="card-btn">Ver Perfil</button>
            </div>
            <div className="info-card">
                <FaInfoCircle />
                <div className="card-content">
                    <h4>Informações</h4>
                    <p>Shipping: {order.shippingInfo.method}</p>
                    <p>Methodo de pagamento: {order.shippingInfo.payment}</p>
                    <p>Status: {order.shippingInfo.status}</p>
                </div>
                <button className="card-btn">Download Info</button>
            </div>
            <div className="info-card">
                <FaMapMarkerAlt />
                <div className="card-content">
                    <h4>Endereço</h4>
                    <p>Endereço: {order.client.address}</p>
                    <p>Cidade: {order.client.city}</p>
                    <p>CEP: {order.client.zip}</p>
                </div>
                <button className="card-btn">View profile</button>
            </div>
        </div>
    );
};

export default OrderInfoCards;