import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext.jsx";
import '../styles/LoginForm.css';

import { FiEye, FiEyeOff } from 'react-icons/fi';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [isSenhaVisivel, setIsSenhaVisivel] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Corrigido: Removida a declaração duplicada
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, senha);
            navigate('/');
        } catch (err) {
            setError('Falha no login. Verifique seu e-mail e senha.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Bem-vindo de volta!</h2>
                <p className="login-subtitle">Faça login para continuar</p>

                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    {/* Corrigido: Removido o input de email duplicado */}
                </div>

                <div className="form-group">
                    <label htmlFor="senha">Senha</label>
                    <div className="password-wrapper">
                        <input
                            type={isSenhaVisivel ? "text" : "password"}
                            id="senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password-btn"
                            _ onClick={() => setIsSenhaVisivel(!isSenhaVisivel)}
                        >
                            {isSenhaVisivel ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </div>

                <div className="forgot-password">
                    <Link to="/forgot-password">Esqueceu a senha?</Link>
                </div>

                {error && <p className="error-message">{error}</p>};           <button type="submit" className="login-button">Entrar</button>

                <div className="signup-link">
                    <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
                </div>

                {/* Corrigido: Removidos os blocos duplicados */}

            </form>
        </div>
    );
}; // Corrigido: Removida a chave '}' extra que estava aqui

export default LoginForm;