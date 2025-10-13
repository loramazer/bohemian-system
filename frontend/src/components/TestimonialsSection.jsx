// frontend/src/components/TestimonialsSection.jsx

import React, { useState } from 'react'; 
import TestimonialCard from './Shared/TestimonialCard.jsx';
import placeholderImage from '../assets/placeholder-person.png'; 
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 

import '../styles/TestimonialsSection.css';
import '../styles/TestimonialCard.css'; 

const testimonialsData = [
    // ... (Mantenha seus 4 depoimentos aqui)
    { id: 1, name: 'Leonardo Luiz', tag: 'Excelente!', text: 'Os arranjos são sempre frescos e a entrega é pontual. A atenção aos detalhes realmente captura o estilo boêmio que eu procurava.', image: placeholderImage, },
    { id: 2, name: 'Ana Carolina', tag: 'Perfeito para Presente', text: 'Pedi o buquê de girassóis e rosas e foi um sucesso! O visual é incrivelmente lindo e o preço é justo. Recomendo muito!', image: placeholderImage, },
    { id: 3, name: 'Roberto Silva', tag: 'Ótima Qualidade', text: 'A qualidade das flores desidratadas superou minhas expectativas. A durabilidade e o aroma são fantásticos. Virei cliente!', image: placeholderImage, },
    { id: 4, name: 'Maria Eduarda', tag: 'Decoração Fantástica', text: 'Comprei um arranjo para minha sala e ele transformou completamente o ambiente. As flores são vibrantes e a peça é artesanal. Amei!', image: placeholderImage, },
];

const itemsPerView = 3; 
const totalItems = testimonialsData.length;

const TestimonialsSection = () => {
    // Usamos um índice simples para rastrear o elemento visível mais à esquerda.
    const [currentIndex, setCurrentIndex] = useState(0); 

    const handleNext = () => {
        // Move 1 card para frente. Se estiver no final, volta para o primeiro card.
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
    };

    const handlePrev = () => {
        // Move 1 card para trás. Se estiver no início, vai para o último card.
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
    };

    // A translação calcula a distância de movimento em porcentagem.
    // 100% / 3 cards visíveis = 33.33% de translação por card.
    const translateValue = currentIndex * (100 / totalItems); 
    // NOVO: Usamos totalItems no cálculo de translação para garantir que cada card tenha seu 'slot'

    return (
        <section className="testimonials-section">
            <h2 className="section-title">O que dizem nossos clientes</h2>
            
            <div className="testimonials-display-wrapper">
                
                {/* Botão Anterior */}
                <button 
                    onClick={handlePrev} 
                    className="control-btn side-btn prev-btn" 
                    aria-label="Depoimento Anterior"
                >
                    <FaChevronLeft size={20} />
                </button>
                
                {/* Janela de Visualização (CRÍTICO: Onde o overflow: hidden está) */}
                <div className="carousel-window">
                    <div 
                        className="testimonials-grid"
                        // Aplica a translação horizontal. O CSS define a largura correta dos cards.
                        style={{ transform: `translateX(-${currentIndex * (100 / totalItems)}%)` }}
                    >
                        {/* Mapeia TODOS os depoimentos (o CSS força 3 visíveis e trata o resto) */}
                        {testimonialsData.map((testimonial) => ( 
                            <TestimonialCard
                                key={testimonial.id}
                                imageSrc={testimonial.image}
                                name={testimonial.name}
                                tag={testimonial.tag}
                                text={testimonial.text}
                            />
                        ))}
                    </div>
                </div>

                {/* Botão Próximo */}
                <button 
                    onClick={handleNext} 
                    className="control-btn side-btn next-btn" 
                    aria-label="Próximo Depoimento"
                >
                    <FaChevronRight size={20} />
                </button>
            </div>
            
            {/* O indicador de página foi removido/escondido para o carrossel infinito */}
            
        </section>
    );
};

export default TestimonialsSection;