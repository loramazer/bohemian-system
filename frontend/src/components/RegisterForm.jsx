// frontend/src/components/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/RegisterForm.css';
import apiClient from '../api';

const RegisterForm = () => {
    // Estados para os campos do formulário
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');

    // Novos estados para feedback
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        setIsLoading(true); // Inicia o indicador de carregamento

        if (!nome || !email || !senha) {
            setMessage('Por favor, preencha todos os campos obrigatórios.');
            setIsError(true);
            setIsLoading(false);
            return;
        }

        try {
            await apiClient.post('/auth/registrar', {
                nome,
                email,
                telefone,
                senha,
            });

            // Se deu certo
            setIsLoading(false);
            setMessage('Cadastro realizado com sucesso! Redirecionando para o login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000); // Espera 2 segundos antes de redirecionar

        } catch (err) {
            // Se deu errado
            setIsLoading(false);
            const errorMessage = err.response?.data?.error || 'Erro ao realizar o cadastro. Tente novamente.';
            setMessage(errorMessage);
            setIsError(true);
            console.error('Erro no cadastro:', err);
        }
    };

    return (
        <div className="register-form-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Criar Conta</h2>

                {/* --- Novo Bloco de Mensagens --- */}
                {message && (
                    <p className={isError ? 'feedback-message error' : 'feedback-message success'}>
                        {message}
                    </p>
                )}

                <div className="form-group">
                    <label htmlFor="nome">Nome Completo</label>
                    <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        disabled={isLoading} // Desabilita o campo durante o carregamento
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="telefone">Telefone</label>
                    <input
                        type="tel"
                        id="telefone"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        disabled={isLoading}
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
                        disabled={isLoading}
                    />
                </div>
                <button type="submit" className="register-button" disabled={isLoading}>
                    {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;