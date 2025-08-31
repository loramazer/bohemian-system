// loramazer/bohemian-system/bohemian-system-front-back-carrinhos/frontend/src/components/LoginForm.jsx

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// Correção: Mude a importação para usar chaves {}
import { AuthContext } from '../context/AuthContext';
import '../styles/LoginForm.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext); // Esta parte já está correta
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, senha);
            navigate('/'); // Redireciona para a home page após o login
        } catch (err) {
            setError('Falha no login. Verifique seu e-mail e senha.');
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">Entrar</button>
            <div className="form-links">
                <a href="/forgot-password">Esqueceu a senha?</a>
                <span>|</span>
                <a href="/register">Cadastre-se</a>
            </div>
        </form>
    );
};

export default LoginForm;