<<<<<<< HEAD
import React from 'react';
import './RegisterForm.css';


const RegisterForm = () => {
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api'; // 1. Importe o apiClient
import '../components/RegisterForm.css';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        senha: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // 2. Use o apiClient para fazer a requisição
            const response = await apiClient.post('/auth/register', formData);

            // Se o registro for bem-sucedido, redirecione para o login
            if (response.status === 201) {
                navigate('/login');
            }
        } catch (err) {
            // Pega a mensagem de erro do backend, se houver
            const errorMessage = err.response?.data?.message || 'Erro ao registrar. Tente novamente.';
            setError(errorMessage);
            console.error('Erro de rede:', err);
        }
    };

    // ... (seu JSX do formulário continua o mesmo)
>>>>>>> origin/front-back-carrinhos
    return (
        <div className="register-form-container">
            <h2 className="register-title">Registrar-se</h2>
            <p className="register-subtitle">Por favor, preencha os campos abaixo.</p>
<<<<<<< HEAD
            <form className="register-form">
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" placeholder="Seu email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Senha</label>
                    <input type="password" id="password" name="password" placeholder="Sua senha" required />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Telefone</label>
                    <input type="tel" id="phone" name="phone" placeholder="Seu telefone" required />
                </div>
=======
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nome">Nome Completo</label>
                    <input type="text" id="nome" name="nome" placeholder="Seu nome" value={formData.nome} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" placeholder="Seu email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="telefone">Telefone</label>
                    <input type="tel" id="telefone" name="telefone" placeholder="Seu telefone" value={formData.telefone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="senha">Senha</label>
                    <input type="password" id="senha" name="senha" placeholder="Sua senha" value={formData.senha} onChange={handleChange} required />
                </div>
                {error && <p className="error-message">{error}</p>}
>>>>>>> origin/front-back-carrinhos
                <button type="submit" className="register-button">Cadastrar</button>
            </form>
        </div>
    );
};

export default RegisterForm;