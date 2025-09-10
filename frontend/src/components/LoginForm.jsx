import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        senha: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

  const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

if (response.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userName', data.nome);
    navigate('/');
    window.location.reload(); 
        } else {
                alert(data.message || 'Erro no login. Verifique suas credenciais.');
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="login-form-container">
            <h2 className="login-title">Login</h2>
            <p className="login-subtitle">Por favor, faça login usando os dados abaixo.</p>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" placeholder="Seu email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="senha">Senha</label>
                    <input type="password" id="senha" name="senha" placeholder="Sua senha" value={formData.senha} onChange={handleChange} required />
                </div>
                <div className="forgot-password">
                    <Link to="/forgot-password">Esqueceu sua Senha?</Link>
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
            <div className="signup-link">
                <p>Não tem uma conta? <Link to="/register">Criar conta</Link></p>
            </div>
        </div>
    );
};

export default LoginForm;