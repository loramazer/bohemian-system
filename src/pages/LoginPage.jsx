import React from 'react';
import LoginForm from '../components/LoginForm.jsx';
import '../styles/LoginPage.css';

const LoginPage = () => {
    return (
        <main className="login-main-content">
            <div className="login-breadcrumbs">
                <span>Home</span> &gt; <span>Login</span>
            </div>
            <div className="login-form-wrapper">
                <LoginForm />
            </div>
 
        </main>
    );
};

export default LoginPage;