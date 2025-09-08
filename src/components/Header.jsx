import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaHeart, FaShoppingCart, FaSearch } from 'react-icons/fa';
import './Header.css';

const Header = () => {
    return (
        <header className="main-header">
            <div className="header-top">
                <div className="contact-info">
                    <span>(42)999854-3532</span>
                    <span>bohemian@gmail.com</span>
                </div>
                <div className="user-actions">
                    <Link to="/login" className="user-link">Login</Link>
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
                        <img src="/bohemian-logo.png" alt="Bohemian Home Floral Decor Logo" className="logo" />
                    </Link>
                </div>
                
                <nav className="main-nav">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/sobre-nos">Sobre Nós</Link></li>
                        <li><Link to="/products">Produtos</Link></li>
                        <li><Link to="/products">Comprar</Link></li> 
                        <li><Link to="/contato">Contato</Link></li>
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