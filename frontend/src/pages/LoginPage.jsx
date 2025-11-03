import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm.jsx';
import '../styles/LoginPage.css';

const LoginPage = () => {
    return (
        <main className="login-main-content">
            <div className="login-breadcrumbs">
                <Link to="/">Home</Link> &gt; <span>Login</span>
            </div>
            <div className="login-form-wrapper">
                <LoginForm />
            </div>

 
        </main>
    );
};

export default LoginPage;