import React from 'react';
import { Link } from 'react-router-dom';
import ContentWrapper from '../components/ContentWrapper.jsx';
import sobreNosImage from '../assets/sobre-nos.png';

import '../styles/AboutPage.css';

const AboutPage = () => {
    return (
        <ContentWrapper>
            <main className="about-main-content">
                <div className="about-breadcrumbs">
                    <Link to="/">Home</Link> &gt; <span>Sobre Nós</span>
                </div>
                
                <h1 className="about-page-title">Sobre a Bohemian Home</h1>
                
                <div className="about-section">
                    <div className="about-text">
                        <p>
                            A Bohemian Home Floral Decor nasceu da paixão por arranjos florais únicos e personalizados. Nossa missão é trazer a beleza da natureza para a sua casa e momentos especiais, com um toque artesanal e boêmio que reflete a nossa identidade.
                        </p>
                        <p>
                            Acreditamos que cada flor conta uma história, e por isso, trabalhamos com espécies diferenciadas para criar arranjos exclusivos, que combinam com a sua personalidade. Além disso, oferecemos presentes que unem flores, vinhos e chocolates para tornar cada ocasião inesquecível.
                        </p>
                    </div>
                    <div className="about-image-container">
                        <img src={sobreNosImage} alt="Sobre a Bohemian Home" className="about-image" />
                    </div>
                </div>
            </main>
        </ContentWrapper>
    );
};

export default AboutPage;