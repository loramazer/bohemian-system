import React from 'react';
import './ServicesSection.css'; // Vamos criar este arquivo de estilo

const services = [
  {
    icon: '🚚', // Pode substituir por um SVG ou ícone de biblioteca
    title: 'Entrega confiável',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa purus gravida.'
  },
  {
    icon: '💰',
    title: 'Preço Justo',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa purus gravida.'
  },
  {
    icon: '🏆',
    title: 'Qualidade',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa purus gravida.'
  },
  {
    icon: '💬',
    title: 'Suporte',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa purus gravida.'
  },
];

const ServicesSection = () => {
  return (
    <section className="services-section">
      <div className="services-title">
        <h2>O que a Bohemian oferece!</h2>
      </div>
      <div className="services-container">
        {services.map((service, index) => (
          <div key={index} className="service-item">
            <span className="service-icon">{service.icon}</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;