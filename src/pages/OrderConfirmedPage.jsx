import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/OrderConfirmedPage.css';

const OrderConfirmedPage = () => {
    return (
        <div className="order-confirmed-container">
            <div className="order-breadcrumbs">
                <span>Home</span> &gt; <span>Pedido Concluído</span>
            </div>
            <div className="order-confirmed-box">
                <div className="checkmark-icon-wrapper">
                    {/* Placeholder para o ícone de checkmark */}
                    <div className="checkmark-icon">&#10003;</div>
                </div>
                <h1 className="confirmation-title">Seu Pedido Foi Enviado</h1>
                <p className="confirmation-message">
                    Obrigado pelo seu pedido! Seu pedido está sendo processado e será concluído dentro de 2 a 3 horas.
                    <br />
                    Você receberá um e-mail de confirmação assim que o pedido for finalizado.
                </p>
                <Link to="/" className="home-button">
                    Voltar para Home
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmedPage;