import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContentWrapper from '../components/ContentWrapper.jsx';
import '../styles/ResetPasswordPage.css';


const ResetPasswordPage = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (newPassword !== confirmPassword) {
            setMessage('As senhas não coincidem.');
            setIsError(true);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setMessage(data.message || 'Erro ao redefinir a senha.');
                setIsError(true);
            }
        } catch (error) {
            setMessage('Erro ao se conectar com o servidor.');
            setIsError(true);
        }
    };

    return (
        <ContentWrapper>
            <main className="reset-password-main">
                <div className="login-form-container">
                    <h2>Redefinir Senha</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            placeholder="Nova Senha"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirmar Nova Senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Redefinir Senha</button>
                    </form>
                    {message && <p className={isError ? 'error-message' : 'success-message'}>{message}</p>}
                </div>
            </main>
        </ContentWrapper>
    );
};

export default ResetPasswordPage;