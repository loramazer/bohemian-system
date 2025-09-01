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
            <div className="brand-logos-section">
                <img src="https://via.placeholder.com/120x60?text=Logo" alt="Brand Logo" />
                <img src="https://via.placeholder.com/120x60?text=Brand+Crafted" alt="Brand Crafted" />
                <img src="https://via.placeholder.com/120x60?text=Mastonix" alt="Mastonix Logo" />
                <img src="https://via.placeholder.com/120x60?text=Sunstone" alt="Sunstone Logo" />
                <img src="https://via.placeholder.com/120x60?text=Partner" alt="Partner Logo" />
            </div>
        </main>
    );
};

export default LoginPage;