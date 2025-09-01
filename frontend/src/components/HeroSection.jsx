import React from 'react';
import './HeroSection.css'; 
import mainImage from '../assets/bohemian-floral.png'; 

const HeroSection = () => {
    return (
        <section className="hero-section">
            {/* Adicionamos uma div separada para o círculo de fundo */}
            <div className="hero-circle-background"></div>
            
            <div className="hero-content">
                <h1>Workshop Bohemian Floral</h1>
                <p>
                    Descubra a arte dos arranjos de flores.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magna in est adipiscing.
                    In phasellus non in justo.
                </p>
                <button className="cta-button">Contratar agora</button>
            </div>
            
            <div className="hero-image-container">
                <img src={mainImage} alt="Arranjo de flores" className="hero-image" />
                <span className="sale-badge">50% off</span>
            </div>
        </section>
    );
};

export default HeroSection;