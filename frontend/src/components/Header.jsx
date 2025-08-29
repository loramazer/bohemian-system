// frontend/src/components/Header.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../assets/bohemian-floral.png';
import AuthContext from '../context/AuthContext';

const Header = () => {
    // CORREÇÃO: Adiciona um objeto vazio como fallback ({}) para o caso de o contexto ser nulo.
    // Isto previne o erro de desestruturação "cannot destructure property of null".
    const { user, logout, isLoading } = useContext(AuthContext) || {};
    const navigate = useNavigate();

    const handleLogout = () => {
        // A função logout só será chamada se existir, evitando erros.
        if (logout) {
            logout();
        }
        navigate('/');
    };

    // Se isLoading for true (ou undefined durante o primeiro instante), mostramos um estado de carregamento.
    if (isLoading !== false) {
        return (
            <header className="header">
                <div className="header-container">
                    <div className="logo-container">
                        <Link to="/">
                            <img src={logo} alt="Bohemian Logo" className="logo" />
                        </Link>
                    </div>
                    <nav className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to="/catalog">Catálogo</Link>
                        <Link to="/about">Sobre Nós</Link>
                    </nav>
                    <div className="header-actions">
                        {/* Vazio enquanto carrega */}
                        <Link to="/cart" className="cart-icon">
                            <i className="fas fa-shopping-cart"></i>
                        </Link>
                    </div>
                </div>
            </header>
        );
    }

    // Após o carregamento, mostra a versão correta do cabeçalho
    return (
        <header className="header">
            <div className="header-container">
                <div className="logo-container">
                    <Link to="/">
                        <img src={logo} alt="Bohemian Logo" className="logo" />
                    </Link>
                </div>
                <nav className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/catalog">Catálogo</Link>
                    <Link to="/about">Sobre Nós</Link>
                </nav>
                <div className="header-actions">
                    {user ? (
                        <>
                            <span className="welcome-message">Olá, {user.nome}!</span>
                            <button onClick={handleLogout} className="auth-link">Sair</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="auth-link">Login</Link>
                            <span className="separator">|</span>
                            <Link to="/register" className="auth-link">Registrar</Link>
                        </>
                    )}
                    <Link to="/cart" className="cart-icon">
                        <i className="fas fa-shopping-cart"></i>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
