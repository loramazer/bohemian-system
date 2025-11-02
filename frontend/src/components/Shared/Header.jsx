// frontend/src/components/Shared/Header.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } // Importe useNavigate
 from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaSearch, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/Header.css';
import { AuthContext } from "../../context/AuthContext.jsx";
import { CartContext } from "../../context/CartContext.jsx";
import logoImage from '../../assets/bohemian-logo.png';

const Header = () => {
    const [adminOpen, setAdminOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false); // NOVO: Estado para dropdown do usuário
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate(); 

    const [searchTerm, setSearchTerm] = useState('');

    const cartCount = cartItems.reduce((total, item) => total + item.quantidade, 0);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault(); 
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
             navigate('/products');
        }
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
                            {/* Mensagem de Olá (visível para admin e comum) */}
                            <span className="welcome-message">Olá, {user.nome}</span>

                        {/* SEÇÃO DO ADMIN */}
                        {user.admin === 1 && ( 
                            <div className="admin-menu-toggle">
                                <span className="admin-link" onClick={() => setAdminOpen(!adminOpen)}>
                                    Admin <FaChevronDown size={10} />
                                </span>
                                {adminOpen && (
                                    <div className="admin-dropdown" onMouseLeave={() => setAdminOpen(false)}>
                                        <Link to="/dashboard">Dashboard</Link>
                                        <Link to="/admin/products/add">Criar Produto</Link>
                                        <Link to="/admin/orders">Ver Pedidos</Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- NOVO: SEÇÃO DO USUÁRIO COMUM --- */}
                        {user.admin !== 1 && (
                            <>
                                {/* Dropdown "Minha Conta" */}
                                <div className="user-menu-toggle">
                                    <span className="user-link" onClick={() => setUserOpen(!userOpen)}>
                                        Minha Conta <FaChevronDown size={10} />
                                    </span>
                                    {userOpen && (
                                        <div className="user-dropdown" onMouseLeave={() => setUserOpen(false)}>
                                            <Link to="/minha-conta">Meus Dados</Link>
                                            <Link to="/meus-pedidos">Meus Pedidos</Link>
                                        </div>
                                    )}
                                </div>
                            
                                {/* Ícones de Desejos e Carrinho */}
                                <Link to="/wishlist" className="icon-link"><FaHeart /></Link>
                                <Link to="/cart" className="icon-link cart-icon-container">
                                    <FaShoppingCart /> 
                                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                                </Link>
                            </>
                        )}
                            
                            {/* Botão de Sair (comum a ambos) */}
                            <button onClick={handleLogout} className="logout-btn">
                                Sair <FaSignOutAlt />
                            </button>
                        </>
                    ) : (
                        // Usuário Deslogado
                        <Link to="/login" className="login-btn-final-style">Login</Link>
                    )}

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
                        <li><Link to="/contato">Contato</Link></li>
                    </ul>
                </nav>

                <form className="search-container" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                    <button type="submit" className="search-button">
                        <FaSearch size={16} />
                    </button>
                </form>
            </div>
        </header>
    );
};

export default Header;