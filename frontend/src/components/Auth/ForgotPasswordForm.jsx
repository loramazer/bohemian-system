import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPasswordForm.css';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Em um projeto real, aqui você faria uma chamada para a sua API
        // para enviar o e-mail de recuperação de senha.
        // Por agora, vamos simular a resposta.

        if (email) {
            setMessage('Se um e-mail com este endereço for encontrado, um link de recuperação será enviado.');
        } else {
            setMessage('Por favor, insira um e-mail válido.');
        }
    };

    return (
        <div className="forgot-password-form-container">
            <h2 className="form-title">Esqueceu sua Senha?</h2>
            <p className="form-subtitle">Por favor, insira o seu e-mail para receber um link de recuperação.</p>
            <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Seu e-mail"
                        required
                    />
                </div>
                {message && <p className="form-message">{message}</p>}
                <button type="submit" className="submit-button">Enviar</button>
            </form>
            <div className="back-to-login">
                <Link to="/login">Voltar para o Login</Link>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;