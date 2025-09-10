import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaHeart, FaShoppingCart, FaSearch } from 'react-icons/fa';
import './Header.css';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedName = localStorage.getItem('userName');
        if (token && storedName) {
            setIsLoggedIn(true);
            setUserName(storedName);
        } else {
            setIsLoggedIn(false);
            setUserName('');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setIsLoggedIn(false);
        setUserName('');
        navigate('/');
        window.location.reload();
    };

    return (
        <header className="main-header">
            <div className="header-top">
                <div className="contact-info">
                    <span>(42)999854-3532</span>
                    <span>bohemian@gmail.com</span>
                </div>
                <div className="user-actions">
                    {isLoggedIn ? (
                        <>
                            <span className="user-name">Olá, {userName}</span>
                            <button onClick={handleLogout} className="user-link">Efetuar Logoff</button>
                            <Link to="/wishlist" className="user-link icon-container"><FaHeart /></Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="user-link">Login</Link>
                            <span> | </span>
                            <Link to="/wishlist" className="user-link">Wishlist</Link>
                            <Link to="/wishlist" className="icon-container"><FaHeart /></Link>
                        </>
                    )}
                    <Link to="/cart" className="icon-container"><FaShoppingCart /></Link>
                </div>
            </div>
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
                        <li><Link to="/cart">Comprar</Link></li>
                        <li><Link to="/contato">Contato</Link></li>
                        
                        {isLoggedIn && (
                            <li className="admin-menu">
                                <Link to="/dashboard" className="admin-link">Admin</Link>
                                <ul className="admin-menu-dropdown">
                                    <li><Link to="/dashboard">Painel</Link></li>
                                    <li><Link to="/admin/products">Todos Produtos</Link></li>
                                    <li><Link to="/admin/products/add">Adicionar Produtos</Link></li>
                                    <li><Link to="/admin/orders">Pedidos</Link></li>
                                </ul>
                            </li>
                        )}
                    </ul>
                </nav>
                <nav className="main-nav">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/sobre-nos">Sobre Nós</Link></li>
                        <li><Link to="/products">Produtos</Link></li>
                        <li><Link to="/comprar">Comprar</Link></li> 
                        <li><Link to="/contato">Contato</Link></li>
                        <li><Link to="/create-product">Criar Produto</Link></li> {/* Adicione este link */}
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