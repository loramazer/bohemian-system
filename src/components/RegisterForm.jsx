import React from 'react';
import './RegisterForm.css';


const RegisterForm = () => {
    return (
        <div className="register-form-container">
            <h2 className="register-title">Registrar-se</h2>
            <p className="register-subtitle">Por favor, preencha os campos abaixo.</p>
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
                <button type="submit" className="register-button">Cadastrar</button>
            </form>
        </div>
    );
};

export default RegisterForm;