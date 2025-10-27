import React from 'react';
import { Link } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import RegisterForm from '../components/RegisterForm.jsx'; // <--- CORREÇÃO: Importar o componente
import '../styles/RegisterForm.css';

const RegisterPage = () => {
    return (
        <ContentWrapper>
            <main className="register-main-content">
                <div className="register-breadcrumbs">
                    <Link to="/">Home</Link> &gt; <span>Criar Conta</span>
                </div>
                <div className="register-form-wrapper">
                    <RegisterForm />
                </div>
            </main>
        </ContentWrapper>
    );
};

export default RegisterPage;