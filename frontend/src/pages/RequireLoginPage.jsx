import React from 'react';
import { Link } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import { FaLock } from 'react-icons/fa';
import '../styles/RequireLoginPage.css'; 

const RequireLoginPage = () => {
    return (
        <ContentWrapper>
            <main className="require-login-main-content">
                <div className="login-message-box">
                    <FaLock className="lock-icon" />
                    <h1 className="message-title">Acesso Restrito</h1>
                    <p className="message-subtitle">
                        Parece que você ainda não fez login ou sua sessão expirou.
                        Para adicionar produtos ao carrinho e finalizar a compra, por favor, entre na sua conta.
                    </p>
                    <div className="action-buttons">
                        <Link to="/login" className="login-btn">Fazer Login</Link>
                        <Link to="/register" className="register-btn">Criar Conta</Link>
                    </div>
                    <Link to="/products" className="continue-shopping">
                        Continuar Comprando
                    </Link>
                </div>
            </main>
        </ContentWrapper>
    );
};

export default RequireLoginPage;