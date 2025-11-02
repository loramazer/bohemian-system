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
                    {/* --- Textos traduzidos --- */}
                    <p>Nome: {order.client.name}</p>
                    <p>Email: {order.client.email}</p>
                    <p>Telefone: {order.client.phone}</p>
                </div>
                {/* --- Botão removido (Task 2) --- */}
            </div>
            <div className="info-card">
                <FaInfoCircle />
                <div className="card-content">
                    <h4>Informações</h4>
                    {/* --- Textos traduzidos e typo corrigido --- */}
                    <p>Envio: {order.shippingInfo.method}</p>
                    <p>Método de pagamento: {order.shippingInfo.payment}</p>
                    <p>Status: {order.shippingInfo.status}</p>
                </div>
                {/* --- Botão removido (Task 2) --- */}
            </div>
            <div className="info-card">
                <FaMapMarkerAlt />
                <div className="card-content">
                    <h4>Endereço</h4>
                    {/* --- Textos traduzidos --- */}
                    <p>Endereço: {order.client.address}</p>
                    <p>Cidade: {order.client.city}</p>
                    <p>CEP: {order.client.zip}</p>
                </div>
                {/* --- Botão removido (Task 2) --- */}
            </div>
        </div>
    );
};

export default OrderInfoCards;