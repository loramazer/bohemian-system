// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/components/Shared/Footer.jsx
import React from 'react';
import '../../styles/Footer.css';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/bohemian-logo.png'; 

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        
        {/* Seção 1: Logo e Contato/Newsletter (Colunas 1.5x) */}
        <div className="footer-section main-section">
          <Link to="/"> 
            {/* Garantimos que o logo é o asset correto */}
            <img src={logoImage} alt="Bohemian Home Floral Decor Logo" className="footer-logo" />
          </Link>
          
          <div className="address-info">
            <p className="address-title"><strong>Endereço:</strong></p>
            <p>Fagundes Varela, 37 Uvaranas, Ponta Grossa</p>
            <p>PR, 84030-010</p>
          </div>
          
          <div className="newsletter">
            <input type="email" placeholder="Entre com seu Email" />
            <button className="login-button">Login</button>
          </div>
        </div>
        
        {/* Seção 2: Categorias */}
        <div className="footer-section">
          <h4>Categorias</h4>
          <ul>
            <li><a href="#">Desidratadas</a></li>
            <li><a href="#">Box de Flores</a></li>
            <li><a href="#">Debutantes</a></li>
            <li><a href="#">Maternidade</a></li>
            <li><a href="#">Serviços</a></li>
          </ul>
        </div>
        
        {/* Seção 3: Atendimentos (Rotas Funcionais) */}
        <div className="footer-section">
          <h4>Atendimentos</h4>
          <ul>
            <li><Link to="/login">Minha Conta</Link></li> 
            <li><a href="#">Descontos</a></li> 
            <li><a href="#">Devolução</a></li> 
            <li><Link to="/dashboard">Histórico de Pedidos</Link></li> 
          </ul>
        </div>
        
        {/* Seção 4: Páginas (Rotas Funcionais) */}
        <div className="footer-section">
          <h4>Páginas</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/sobre-nos">Sobre nós</Link></li>
            <li><Link to="/products">Produtos</Link></li>
            <li><Link to="/products">Comprar</Link></li> 
            <li><a href="#">Contato</a></li> 
            <li><a href="#">Faq</a></li> 
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>©Webecy - All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;