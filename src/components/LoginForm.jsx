import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LoginForm.css';

const LoginForm = () => {
    return (
        <div className="login-form-container">
            <h2 className="login-title">Login</h2>
            <p className="login-subtitle">Por favor, faça login usando os dados abaixo.</p>
            <form className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" placeholder="Seu email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Senha</label>
                    <input type="password" id="password" name="password" placeholder="Sua senha" required />
                </div>
                <div className="forgot-password">
                     <Link to="/forgot-password">Esqueceu sua Senha?</Link>
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
            <div className="signup-link">
                <p>Não tem uma conta? <Link to="/register">Criar conta</Link></p>
            </div>
        </div>
    );
};

export default LoginForm;