// loramazer/bohemian-system/bohemian-system-front-back-carrinhos/frontend/src/components/Header.jsx

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import bohemianLogo from '/bohemian-logo.png';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    // Se o contexto ainda não carregou, podemos mostrar um header simplificado ou vazio
    if (!auth || auth.loading) {
        return (
            <header className="header">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <img src={bohemianLogo} alt="Bohemian Logo" />
                    </Link>
                </div>
            </header>
        );
    }

    const { user, logout } = auth;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo">
                    <img src={bohemianLogo} alt="Bohemian Logo" />
                </Link>
                <nav className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/catalog">Catálogo</Link>
                    <Link to="/about">Sobre Nós</Link>
                    <Link to="/contact">Contato</Link>
                </nav>
                <div className="header-actions">
                    <div className="search-bar">
                        <input type="text" placeholder="Pesquisar..." />
                        <button>🔍</button>
                    </div>
                    {user ? (
                        <div className="user-menu">
                            <span>Olá, {user.nome}</span>
                            <button onClick={handleLogout} className="logout-btn">Sair</button>
                        </div>
                    ) : (
                        <Link to="/login" className="login-btn">Entrar</Link>
                    )}
                    <Link to="/cart" className="cart-icon">🛒</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;