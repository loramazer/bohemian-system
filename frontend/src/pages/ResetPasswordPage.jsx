import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import apiClient from '../api.js'; // NOVO: Importação do apiClient
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
            // CORRIGIDO: Usando apiClient.post para enviar o token e a nova senha
            const response = await apiClient.post('/auth/reset-password', { token, newPassword: senha });
            
            const data = response.data;
            
            if (response.status === 200) {
                setMessage('Senha redefinida com sucesso! Você será redirecionado para o login.');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                 // Tratamento de erro via corpo da resposta (se for status 2xx)
                setMessage(data.message || 'Ocorreu um erro. Por favor, tente novamente.');
            }

        } catch (error) {
            // Tratamento de erro específico para Axios (captura a mensagem do backend)
            const errorMessage = error.response?.data?.message || 'Não foi possível conectar ao servidor.';
            console.error('Erro ao redefinir senha:', error);
            setMessage(errorMessage);
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