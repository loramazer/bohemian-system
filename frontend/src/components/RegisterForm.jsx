import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import '../styles/RegisterForm.css';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        email: '',
        senha: '',
    });
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.senha !== confirmarSenha) {
            setError('As senhas não coincidem!');
            return;
        }
        try {
            const response = await apiClient.post('/api/auth/register', formData);

            if (response.status === 201) {
                navigate('/login');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro ao registrar. Tente novamente.';
            setError(errorMessage);
            console.error('Erro de rede:', err);
        }
    };

    return (
        <div className="register-form-container">
            <h2 className="register-title">Registrar-se</h2>
            <p className="register-subtitle">Por favor, preencha os campos abaixo.</p>
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nome">Nome Completo</label>
                    <input type="text" id="nome" name="nome" placeholder="Seu nome" value={formData.nome} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="login">Endereço de Email</label>
                    <input type="email" id="login" name="email" placeholder="Seu email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="telefone">Telefone</label>
                    <input type="tel" id="telefone" name="telefone" placeholder="Seu telefone" value={formData.telefone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <div className="label-wrapper"> {/* Novo div para alinhar label e ícone */}
                        <label htmlFor="senha">Senha</label>
                        <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn"
                            title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </button>
                    </div>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="senha"
                        name="senha"
                        placeholder="Sua senha"
                        value={formData.senha}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmarSenha">Confirmar Senha</label>
                    <input
                        // O tipo também é dinâmico para ser consistente
                        type={showPassword ? 'text' : 'password'}
                        id="confirmarSenha"
                        name="confirmarSenha"
                        placeholder="Confirme sua senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="register-button">Cadastrar</button>
            </form>
        </div>
    );
};

export default RegisterForm;