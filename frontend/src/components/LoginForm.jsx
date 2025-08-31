import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import apiClient from '../api.js';
import '../styles/LoginForm.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [formIsLoading, setFormIsLoading] = useState(false);

    const { login, isLoading: isAuthLoading } = useContext(AuthContext) || {};
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        setFormIsLoading(true);

        if (!login) {
            setFormIsLoading(false);
            setMessage('A página ainda está a carregar, por favor, tente novamente em um momento.');
            setIsError(true);
            return;
        }

        try {
            const response = await apiClient.post('/auth/login', { email, senha });
            login(response.data.token);
            setFormIsLoading(false);
            navigate('/'); // Redireciona para a home após o login
        } catch (err) {
            setFormIsLoading(false);
            const errorMessage = err.response?.data?.error || 'E-mail ou senha inválidos.';
            setMessage(errorMessage);
            setIsError(true);
            console.error('Erro no login:', err);
        }
    };

    return (
        <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Entrar na sua Conta</h2>

                {message && (
                    <p className={isError ? 'feedback-message error' : 'feedback-message success'}>
                        {message}
                    </p>
                )}

                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={formIsLoading || isAuthLoading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        disabled={formIsLoading || isAuthLoading}
                    />
                </div>
                <button type="submit" className="login-button" disabled={formIsLoading || isAuthLoading}>
                    {formIsLoading ? 'A entrar...' : 'Entrar'}
                </button>
                <p className="register-link">
                    Não tem uma conta? <Link to="/register">Crie uma aqui</Link>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;

