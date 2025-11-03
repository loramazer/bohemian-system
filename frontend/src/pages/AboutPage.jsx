// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/pages/AboutPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx'; 

import heroImage from '../../public/bohemian-home-hero.jpeg'; 
import destaque1Image from '../../public/bohemian-destaque-1.jpeg';
import destaque2Image from '../../public/bohemian-destaque-2.jpeg';

import '../styles/AboutPage.css';

const AboutPage = () => {
    return (
        <ContentWrapper>
            <main className="about-main-content">
                
                <section className="about-hero">
                    {/* A imagem principal (hero) */}
                    <img src={heroImage} alt="Arranjo Floral Bohemian Home" className="about-hero-image" />
                    <div className="about-hero-overlay">
                        <div className="about-breadcrumbs">
                            <Link to="/">Home</Link> &gt; <span>Sobre Nós</span>
                        </div>
                        <h1 className="about-page-title-hero">Sobre Nós: A Essência Bohemian Home</h1> 
                        <p className="about-hero-subtitle">
                            Trazendo a beleza da natureza para a sua casa e momentos especiais, com um toque artesanal e boêmio único.
                        </p>
                        <a href="#nossa-missao" className="about-hero-cta">Conheça a Nossa História</a>
                    </div>
                </section>
                
                <section className="about-intro-section" id="nossa-missao">
                    <h2 className="about-section-main-title">A Arte de Decorar com Flores</h2>
                    <p className="about-intro-text">
                        A Bohemian Home Floral Decor nasceu da paixão por arranjos florais únicos e personalizados. Nossa missão vai além da decoração: é criar ambientes que inspiram e contam histórias. 
                        Trabalhamos com espécies diferenciadas e um cuidado artesanal que reflete o nosso amor pelo design boêmio.
                    </p>
                </section>

                <section className="about-feature-section feature-odd">
                    <div className="about-text-content">
                        <h3 className="feature-title">Desenvolvendo Arranjos Exclusivos</h3>
                        <p className="feature-description">
                            Acreditamos que cada flor conta uma história. Por isso, combinamos texturas, cores e formas para criar peças que harmonizam perfeitamente com a sua personalidade e o seu ambiente. Cada arranjo é uma **obra de arte única** pensada para transformar seu lar ou evento. A seleção cuidadosa de cada haste e folhagem é o nosso diferencial, garantindo que a beleza do estilo boêmio seja levada com durabilidade e frescor inigualáveis.
                        </p>
                        <p className="feature-description">
                            Nossa curadoria de flores é rigorosa, focada em produtores que compartilham a nossa filosofia de qualidade e sustentabilidade. Da simples flor de vaso ao arranjo de grande impacto, a exclusividade e a paixão artesanal são a nossa assinatura.
                        </p>
                    </div>
                    <div className="about-image-block">
                        {/* A primeira imagem de destaque */}
                        <img src={destaque1Image} alt="Arranjo Exclusivo" className="about-feature-image" />
                    </div>
                </section>

                <section className="about-feature-section feature-even">
                    <div className="about-image-block">
                        {/* A segunda imagem de destaque */}
                        <img src={destaque2Image} alt="Buquê de Noiva" className="about-feature-image" />
                    </div>
                    <div className="about-text-content">
                        <h3 className="feature-title">Celebre os Momentos Mais Especiais</h3>
                        <p className="feature-description">
                            Cada fase da vida merece ser celebrada com a arte das flores. É por isso que nos dedicamos a criar peças que capturam a emoção do momento, como os **buquês exclusivos para noivas**, que refletem a essência e o estilo de cada casamento. A natureza e o design se unem para dar vida à decoração de eventos, cerimônias e festas.
                        </p>
                        <p className="feature-description">
                            Para presentear, vamos além. Nossa seleção de presentes sofisticados une a beleza dos nossos arranjos com a **sofisticação de vinhos** e o prazer de **chocolates artesanais**, tornando qualquer ocasião inesquecível e profundamente pessoal. Entregamos uma experiência completa de carinho e celebração.
                        </p>
                    </div>
                </section>
                
                <section className="about-values-section">
                    <h2 className="about-section-main-title">Nossos Valores</h2>
                    <div className="values-grid">
                        <div className="value-item">
                            <h4>Artesanato</h4>
                            <p>Tudo é feito à mão, com atenção aos mínimos detalhes e um toque pessoal em cada peça.</p>
                        </div>
                        <div className="value-item">
                            <h4>Originalidade</h4>
                            <p>Busca constante por espécies diferenciadas para garantir arranjos verdadeiramente únicos.</p>
                        </div>
                        <div className="value-item">
                            <h4>Paixão</h4>
                            <p>Amor incondicional pela natureza e o desejo de transformar a decoração em uma experiência.</p>
                        </div>
                    </div>
                </section>

            </main>
        </ContentWrapper>
    );
};

export default AboutPage;