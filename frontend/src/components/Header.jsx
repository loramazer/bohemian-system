import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaHeart, FaShoppingCart, FaSearch, FaChevronDown } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <header className="main-header">
      {/* Top bar */}
      <div className="header-top">
        <div className="contact-info">
          <span>(42)999854-3532</span>
          <span>bohemian@gmail.com</span>
        </div>
        <div className="user-actions">
          <Link to="/login" className="user-link">Login</Link>
          <span className="admin-link" onClick={() => setAdminOpen(!adminOpen)}>
            Admin <FaChevronDown />
          </span>
          {adminOpen && (
            <div className="admin-dropdown">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/admin/products">Todos os Produtos</Link>
              <Link to="/admin/orders">Todos os Pedidos</Link>
              <Link to="/admin/products/add">Criar Produto</Link>
            </div>
          )}
          <span> | </span>
          <Link to="/wishlist" className="user-link">Wishlist</Link>
          <Link to="/wishlist" className="icon-container"><FaHeart /></Link>
          <Link to="/cart" className="icon-container"><FaShoppingCart /></Link>
        </div>
      </div>

      {/* Bottom bar */}
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
