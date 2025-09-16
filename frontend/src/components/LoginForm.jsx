import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext.jsx";
import '../styles/LoginForm.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
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
        // Adicionado um contêiner para centralizar o formulário na página
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                {/* --- Elementos Adicionados --- */}
                <h2 className="login-title">Bem-vindo de volta!</h2>
                <p className="login-subtitle">Faça login para continuar</p>
                {/* --------------------------- */}

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

                {/* --- Estrutura dos links ajustada --- */}
                <div className="forgot-password">
                    <Link to="/forgot-password">Esqueceu a senha?</Link>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="login-button">Entrar</button>

                <div className="signup-link">
                    <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
                </div>
                {/* ------------------------------------ */}
            </form>
        </div>
    );
};

export default LoginForm;