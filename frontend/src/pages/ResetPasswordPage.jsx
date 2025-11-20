import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import apiClient from '../api.js'; 
import '../styles/ResetPasswordPage.css'; 

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [senha, setSenha] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Redefinindo sua senha...');
        if (senha.length < 6) {
             setMessage('A nova senha deve ter no mínimo 6 caracteres.');
             return;
        }

        try {
            const response = await apiClient.post('/auth/reset-password', { token, newPassword: senha });
            
            if (response.status === 200) {
                setMessage('Senha redefinida com sucesso! Você será redirecionado para o login.');
                setTimeout(() => navigate('/login'), 3000);
            } 

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Token inválido ou expirado. Tente novamente.';
            console.error('Erro ao redefinir senha:', error);
            setMessage(errorMessage);
        }
    };

    return (
        <ContentWrapper>
            <main className="reset-password-main">
                <div className="login-form-wrapper">
                    <div className="login-form-container">
                        <h2 className="login-title">Redefinir Senha</h2>
                        <p className="login-subtitle">
                            Insira e confirme sua nova senha de acesso.
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
                            {}
                            <button type="submit" className="login-button">Redefinir Senha</button>
                        </form>
                        {}
                        {message && <p className="status-message">{message}</p>}
                    </div>
                </div>
            </main>
        </ContentWrapper>
    );
};

export default ResetPasswordPage;