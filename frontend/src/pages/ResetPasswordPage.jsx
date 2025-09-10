import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContentWrapper from '../components/ContentWrapper.jsx';
import '../styles/LoginPage.css'; 

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [senha, setSenha] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Redefinindo sua senha...');

        try {
            const response = await fetch('http://localhost:3000/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword: senha }),
            });

            const data = await response.json();
            
            if (response.ok) {
                setMessage('Senha redefinida com sucesso! Você será redirecionado para o login.');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setMessage(data.message || 'Ocorreu um erro. Por favor, tente novamente.');
            }

        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            setMessage('Não foi possível conectar ao servidor.');
        }
    };

    return (
        <ContentWrapper>
            <main className="login-main-content">
                <div className="login-form-wrapper">
                    <div className="login-form-container">
                        <h2 className="login-title">Redefinir Senha</h2>
                        <p className="login-subtitle">
                            Digite sua nova senha.
                        </p>
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="senha">Nova Senha</label>
                                <input
                                    type="password"
                                    id="senha"
                                    name="senha"
                                    placeholder="Sua nova senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="login-button">Redefinir Senha</button>
                        </form>
                        {message && <p className="status-message">{message}</p>}
                    </div>
                </div>
            </main>
        </ContentWrapper>
    );
};

export default ResetPasswordPage;