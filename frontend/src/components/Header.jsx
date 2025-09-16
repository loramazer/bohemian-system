import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaSearch, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const [adminOpen, setAdminOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="main-header">
            {/* Top bar */}
            <div className="header-top">
                <div className="contact-info">
                    <span>(42)999854-3532</span>
                    <span>bohemian@gmail.com</span>
                </div>
                <div className="user-actions">
                    {/* --- LÓGICA DE EXIBIÇÃO CORRIGIDA --- */}
                    {user ? (
                        // Se o usuário estiver logado
                        <>
                            <span className="welcome-message">Olá, {user.nome}</span>
                            <button onClick={handleLogout} className="user-link icon-container">
                                Sair <FaSignOutAlt />
                            </button>
                        </>
                    ) : (
                        // Se não houver usuário logado
                        <Link to="/login" className="user-link">Login</Link>
                    )}
                    {/* ------------------------------------ */}

                    {/* Lógica para mostrar o menu de Admin */}
                    {user && user.role === 'admin' && (
                        <span className="admin-link" onClick={() => setAdminOpen(!adminOpen)}>
                            Admin <FaChevronDown />
                        </span>
                    )}

                    {user && user.role === 'admin' && adminOpen && (
                        <div className="admin-dropdown">
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/admin/products/add">Criar Produto</Link>
                        </div>
                    )}

                    <span> | </span>
                    {/* Apenas o ícone do coração é exibido agora */}
                    <Link to="/wishlist" className="icon-container"><FaHeart /></Link>
                    <Link to="/cart" className="icon-container"><FaShoppingCart /></Link>
                </div>
            </div>

            {/* Bottom bar (sem alterações) */}
            <div className="header-bottom">
                <div className="logo-container">
                    <Link to="/">
                        <img src="/bohemian-logo.png" alt="Bohemian Home Floral Decor Logo" className="logo" />
                    </Link>
                </div>
                <nav className="main-nav">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/sobre-nos">Sobre Nós</Link></li>
                        <li><Link to="/products">Produtos</Link></li>
                        <li><Link to="/comprar">Comprar</Link></li>
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