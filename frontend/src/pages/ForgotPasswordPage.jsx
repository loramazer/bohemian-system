// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import apiClient from '../api.js'; // NOVO: Importação do apiClient
import '../styles/ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // CORRIGIDO: Agora realmente chama a API
        setMessage('Enviando solicitação...'); 
        try {
            // CORRIGIDO: Usando apiClient.post
            const response = await apiClient.post('/auth/forgot-password', { email });
            const data = response.data;
            
            // O backend retorna status 200 com uma mensagem genérica por segurança
            if (response.status === 200) {
                // Mensagem de sucesso do backend (por segurança, o backend sempre retorna esta)
                setMessage(data.message); 
            } else {
                 // Caso o status não seja 200 mas não lance erro (improvável com a config do backend)
                setMessage(data.message || 'Ocorreu um erro. Por favor, tente novamente.');
            }
        } catch (error) {
            // Tratamento de erro específico para Axios (captura a mensagem do backend)
            const errorMessage = error.response?.data?.message || 'Ocorreu um erro de rede. Por favor, verifique sua conexão.';
            console.error('Erro ao solicitar redefinição de senha:', error);
            // CORREÇÃO: Define a mensagem de erro para que seja exibida
            setMessage(errorMessage); 
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
                    {/* Lógica de classe para diferenciar cor do status/erro */}
                    {message && (
                        <p className={`status-message ${message.includes('Erro') || message.includes('Falha') ? 'error-status-message' : 'success-message'}`}>
                            {message}
                        </p>
                    )}
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