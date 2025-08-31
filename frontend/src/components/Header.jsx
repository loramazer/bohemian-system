import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaSearch } from 'react-icons/fa';
import './Header.css'; // O CSS que vamos usar
import AuthContext from '../context/AuthContext';
// A logo agora é carregada a partir da pasta 'public'
// import logo from '/bohemian-logo.png'; 

const Header = () => {
    const { user, logout, isLoading } = useContext(AuthContext) || {};
    const navigate = useNavigate();

    const handleLogout = () => {
        if (logout) {
            logout();
        }
        navigate('/');
    };

    return (
        <header className="main-header">
            <div className="header-top">
                <div className="contact-info">
                    <span>(42)999854-3532</span>
                    <span>bohemian@gmail.com</span>
                </div>
                <div className="user-actions">
                    {/* Lógica de Autenticação Dinâmica */}
                    {isLoading ? (
                        <span>Carregando...</span>
                    ) : user ? (
                        <>
                            <span className="welcome-message">Olá, {user.nome}!</span>
                            <button onClick={handleLogout} className="user-link">Sair</button>
                        </>
                    ) : (
                        <Link to="/login" className="user-link">Login</Link>
                    )}
                    <Link to="/dashboard" className="user-link">Admin</Link>
                    <span> | </span>
                    <Link to="/wishlist" className="user-link">Wishlist</Link>
                    <Link to="/wishlist" className="icon-container"><FaHeart /></Link>
                    <Link to="/cart" className="icon-container"><FaShoppingCart /></Link>
                </div>
            </div>
            <div className="header-bottom">
                <div className="logo-container">
                    <Link to="/">
                        {/* Certifique-se que o logo está na pasta 'public' */}
                        <img src="/bohemian-logo.png" alt="Bohemian Home Floral Decor Logo" className="logo" />
                    </Link>
                </div>
                <nav className="main-nav">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">Sobre Nós</Link></li>
                        <li><Link to="/catalog">Produtos</Link></li>
                        <li><Link to="/catalog">Comprar</Link></li>
                        <li><Link to="/contato">Contato</Link></li>
                    </ul>
                </nav>
                <div className="search-container">
                    <input type="text" placeholder="Pesquisar..." />
                    <button className="search-button"><FaSearch /></button>
                </div>
            </div>
        </header>
    );
};

export default Header;
