import React from 'react';
import './Footer.css'; // Vamos criar este arquivo de estilo

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section">
          <img src="/bohemian-logo.png" alt="Bohemian Home Floral Decor Logo" className="footer-logo" />
          <p>
            Endereço:<br/>
            Fagundes Varela, 37 Uvaranas, Ponta Grossa<br/>
            PR, 84030-010
          </p>
          <div className="newsletter">
            <input type="email" placeholder="Entre com seu Email" />
            <button className="login-button">Login</button>
          </div>
        </div>
        <div className="footer-section">
          <h4>Categorias</h4>
          <ul>
            <li><a href="/categorias/desidratadas">Desidratadas</a></li>
            <li><a href="/categorias/box-de-flores">Box de Flores</a></li>
            <li><a href="/categorias/debutantes">Debutantes</a></li>
            <li><a href="/categorias/maternidade">Maternidade</a></li>
            <li><a href="/categorias/servicos">Serviços</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Atendimentos</h4>
          <ul>
            <li><a href="/minha-conta">Minha Conta</a></li>
            <li><a href="/descontos">Descontos</a></li>
            <li><a href="/devolucao">Devolução</a></li>
            <li><a href="/historico-de-pedidos">Histórico de Pedidos</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Páginas</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/sobre-nos">Sobre nós</a></li>
            <li><a href="/produtos">Produtos</a></li>
            <li><a href="/comprar">Comprar</a></li>
            <li><a href="/contato">Contato</a></li>
            <li><a href="/faq">Faq</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>©Webecy - All Rights Reserved</p>
        <div className="social-icons">
          {/* Ícones de redes sociais aqui */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;