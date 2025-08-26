import React from 'react';
import { Link } from 'react-router-dom';
import ContentWrapper from '../components/ContentWrapper.jsx';
import RegisterForm from '../components/RegisterForm.jsx';

import '../styles/RegisterPage.css';

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