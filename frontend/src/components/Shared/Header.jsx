import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaSearch, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/Header.css';
import { AuthContext } from "../../context/AuthContext.jsx";
import { CartContext } from "../../context/CartContext.jsx";
import logoImage from '../../assets/bohemian-logo.png'; 

const Header = () => {
    const [adminOpen, setAdminOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    // RECEBE o estado do carrinho
    const { cartItems } = useContext(CartContext); 
    const navigate = useNavigate();

    // Calcula o total de itens para o badge
    const cartCount = cartItems.reduce((total, item) => total + item.quantidade, 0);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="main-header">
            <div className="header-top">
                <div className="contact-info">
                    <span>(42)999854-3532</span>
                    <span>bohemian@gmail.com</span>
                </div>
                
                <div className="user-actions-group">
                    {user ? (
                        <>
                            <span className="welcome-message">Olá, {user.nome}</span>
                            
                            {user.role === 'admin' && (
                                <div className="admin-menu-toggle">
                                    <span className="admin-link" onClick={() => setAdminOpen(!adminOpen)}>
                                        Admin <FaChevronDown size={10} />
                                    </span>
                                    {adminOpen && (
                                        <div className="admin-dropdown">
                                            <Link to="/dashboard">Dashboard</Link>
                                            <Link to="/admin/products/add">Criar Produto</Link>
                                            <Link to="/admin/orders">Ver Pedidos</Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button onClick={handleLogout} className="logout-btn">
                                Sair <FaSignOutAlt size={14} />
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="login-btn">Login</Link>
                    )}
                    
                    <Link to="/wishlist" className="icon-link"><FaHeart /></Link>
                    
                    {/* Componente do carrinho com badge */}
                    <Link to="/cart" className="icon-link cart-icon-container">
                        <FaShoppingCart size={20} />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>
                </div>
            </div>

            <div className="header-bottom">
                <div className="logo-container">
                    <Link to="/">
                        <img src={logoImage} alt="Bohemian Home Floral Decor Logo" className="logo" />
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
                    <input type="text" placeholder="Pesquisar..." className="search-input" />
                    <button className="search-button"><FaSearch size={16} /></button>
                </div>
            </div>
        </header>
    );
};

export default Header;