// frontend/src/components/HeroSection.jsx

import React from 'react';
import { Link } from 'react-router-dom'; 
import '../styles/HeroSection.css'; 
import mainImage from '../../public/bohemian-floral.png'; 

const HeroSection = () => {
    return (
        <section className="hero-section">
            <div className="hero-content">
                <h1>Flores Frescas & Decoração Bohemian</h1>
                <p>
                    Descubra arranjos florais únicos e itens de decoração artesanais que trazem vida e estilo para qualquer ambiente. Entregamos a beleza diretamente para você.
                </p>
                <Link to="/products" className="cta-button">Ver Catálogo</Link> 
            </div>
            
            <div className="hero-image-container">
                <img src={mainImage} alt="Arranjo de flores Bohemian Floral" className="hero-image" />
            </div>
        </section>
    );
};

export default HeroSection;