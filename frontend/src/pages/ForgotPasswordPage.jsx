import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ContentWrapper from '../components/ContentWrapper.jsx';
import '../styles/ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Enviando solicitação...');
        try {
            const response = await fetch('http://localhost:3000/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Se as informações estiverem corretas, você receberá um e-mail com as instruções para redefinir sua senha.');
            } else {
                setMessage(data.message || 'Ocorreu um erro. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao solicitar redefinição de senha:', error);
            setMessage('Ocorreu um erro de rede. Por favor, verifique sua conexão.');
        }
    };

    return (
        <ContentWrapper>
            <main className="forgot-password-main-content">
                <div className="forgot-password-form-wrapper">
                    <div className="forgot-password-form-container">
                        <h2 className="forgot-password-title">Esqueceu sua Senha?</h2>
                        <p className="forgot-password-subtitle">
                            Digite seu endereço de e-mail e enviaremos um link para redefinir sua senha.
                        </p>
                        <form className="forgot-password-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Seu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="send-link-button">Enviar Link de Redefinição</button>
                        </form>
                        {message && <p className="status-message">{message}</p>}
                        <div className="back-to-login">
                            <Link to="/login">Voltar para o Login</Link>
                        </div>
                    </div>
                </div>
            </main>
        </ContentWrapper>
    );
};

export default ForgotPasswordPage;