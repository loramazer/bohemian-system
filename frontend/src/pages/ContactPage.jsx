import React from 'react';
import { Link } from 'react-router-dom';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa'; 
import '../styles/ContactPage.css';

// Componente ContactPage
const ContactPage = () => {
    // Dados de Contato
    const contactInfo = {
        phone: "(42) 999854-3532",
        email: "bohemian@gmail.com",
        address: "R. Mal. Deodoro da Fonseca, 51 - Centro, Ponta Grossa - PR, 84010-030",
        openingHours: [
            "Segunda a Sexta: 9:30 às 17:30",
            "Sábado: 10:00 às 13:00",
            "Domingos e Feriados: Fechado"
        ]
    };

    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.865223398492!2d-50.1610993849836!3d-25.09341618394464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94e437021e102287%3A0xc660d2b8f8a1836c!2sR.%20Mal.%20Deodoro%20da%20Fonseca%2C%2051%20-%20Centro%2C%20Ponta%20Grossa%20-%20PR%2C%2084010-030!5e0!3m2!1spt-BR!2sbr!4v1633534567890!5m2!1spt-BR!2sbr"; 

    return (
        <ContentWrapper>
            <main className="contact-main-content">
                <section className="contact-hero-section">
                    <div className="contact-breadcrumbs">
                        <Link to="/">Home</Link> &gt;  <span>Contato</span>
                    </div>
                    <h1 className="contact-page-title">Nossa Boutique Floral</h1>
                    <p className="contact-subtitle-sophisticated">
                        A excelência no atendimento é parte da nossa arte. Fale conosco para iniciar seu projeto de decoração ou encomendar um presente exclusivo. Nosso serviço é totalmente personalizado.
                    </p>
                </section>

                <section className="contact-content-grid-v2">
                    
                    {/* Bloco de Informações - APENAS Telefone e Email */}
                    <div className="contact-info-container-v2">
                        <h2>Para um Atendimento Personalizado</h2>

                        <div className="info-item-sophisticated">
                            <span className="info-icon"><FaPhoneAlt /></span>
                            <div>
                                <h3>Consultoria Express (Telefone)</h3>
                                <p>Fale diretamente com nossa florista para orçamentos e ajustes rápidos no seu pedido.</p>
                                <a href={`tel:${contactInfo.phone.replace(/[\s-()]/g, "")}`} className="contact-link">{contactInfo.phone}</a>
                            </div>
                        </div>
                        
                        <div className="info-item-sophisticated" style={{ borderBottom: 'none', marginBottom: '0' }}>
                            <span className="info-icon"><FaEnvelope /></span>
                            <div>
                                <h3>Projetos e Parcerias (Email)</h3>
                                <p>Para projetos de decoração de interiores ou parcerias de longo prazo, utilize nosso email.</p>
                                <a href={`mailto:${contactInfo.email}`} className="contact-link">{contactInfo.email}</a>
                            </div>
                        </div>
                    </div>

                    {/* Bloco do Mapa e HORÁRIO DE FUNCIONAMENTO */}
                    <div className="contact-map-container">
                        <h2>Onde Nos Encontrar</h2>
                        <div className="map-embed-wrapper">
                            <iframe
                                src={mapEmbedUrl}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="google-map-iframe"
                                title="Localização Bohemian Home"
                            ></iframe>
                        </div>
                        <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="map-link-cta"
                        >
                            Ver Rotas Detalhadas no Google Maps
                        </a>

                        {/* SEÇÃO SIMPLIFICADA COM APENAS O HORÁRIO */}
                        <div className="map-additional-info">
                            {/* O ícone do endereço foi removido */}
                            
                            <div className="info-item-hours map-info-item" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
                                <span className="info-icon"><FaClock /></span>
                                <div>
                                    <h3>Horário de Funcionamento</h3>
                                    {contactInfo.openingHours.map((hour, index) => (
                                        <p key={index} className="hour-detail-sophisticated">{hour}</p>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
        </ContentWrapper>
    );
};

export default ContactPage;