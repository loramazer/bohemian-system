// frontend/src/components/TestimonialsSection.jsx

import React from 'react'; 
import TestimonialCard from './Shared/TestimonialCard.jsx';
import placeholderImage from '../assets/placeholder-person.png'; 

// Importamos apenas o CSS da seção e do card. O CSS do carrossel será ajustado.
import '../styles/TestimonialsSection.css';
import '../styles/TestimonialCard.css'; 

const testimonialsData = [
    // Usaremos apenas os 3 primeiros para o layout estático desejado
    { id: 1, name: 'Leonardo Luiz', tag: 'Excelente!', text: 'Os arranjos são sempre frescos e a entrega é pontual. A atenção aos detalhes realmente captura o estilo boêmio que eu procurava.', image: placeholderImage, },
    { id: 2, name: 'Ana Carolina', tag: 'Perfeito para Presente', text: 'Pedi o buquê de girassóis e rosas e foi um sucesso! O visual é incrivelmente lindo e o preço é justo. Recomendo muito!', image: placeholderImage, },
    { id: 3, name: 'Roberto Silva', tag: 'Ótima Qualidade', text: 'A qualidade das flores desidratadas superou minhas expectativas. A durabilidade e o aroma são fantásticos. Virei cliente!', image: placeholderImage, },
    { id: 4, name: 'Maria Eduarda', tag: 'Decoração Fantástica', text: 'Comprei um arranjo para minha sala e ele transformou completamente o ambiente. As flores são vibrantes e a peça é artesanal. Amei!', image: placeholderImage, },
];

const TestimonialsSection = () => {
    // Pegamos apenas os 3 primeiros para exibição estática
    const staticTestimonials = testimonialsData.slice(0, 3);

    return (
        <section className="testimonials-section">
            <h2 className="section-title">O que dizem nossos clientes</h2>
            
            {/* O wrapper agora é um contêiner simples para centralizar a grade */}
            <div className="testimonials-static-wrapper">
                
                {/* A grade deve garantir o layout lado a lado */}
                <div className="testimonials-grid">
                    {staticTestimonials.map((testimonial) => ( 
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
            
            {/* Removemos botões e indicadores */}
            
        </section>
    );
};

export default TestimonialsSection;