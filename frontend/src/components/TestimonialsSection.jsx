// frontend/src/components/TestimonialsSection.jsx

import React from 'react'; 
import TestimonialCard from './Shared/TestimonialCard.jsx';
import placeholderImage from '../../public/imagemc1.jpg'; 
import cintiaImage from '../../public/imagemc2.jpg'; 
import '../styles/TestimonialsSection.css';
import '../styles/TestimonialCard.css'; 

const testimonialsData = [
    {
        id: 1, name: 'Flávia Roberta Pessoa do Lago M. Marchiori', tag: 'Cliente Fiel!', text: 'Sou cliente desde o comecinho e sigo apaixonada até hoje! Cada entrega é especial: as flores chegam sempre lindas, fresquinhas e com um cuidado que dá pra sentir em cada detalhe.Mais do que decorar a casa, elas trazem leveza, cor e alegria para a rotina.É aquele toque que muda o clima do ambiente e o humor do dia. Ver o crescimento da empresa e perceber que, mesmo com o tempo, o carinho continua o mesmo é algo que admiro muito.É um presente que me dou toda semana e que não abro mão!', image: placeholderImage, },
    {
        id: 2, name: 'Cinthia Ribas Scremin', tag: 'Marcando momentos!', text: 'A Bohemian faz parte da minha vida desde o meu casamento! Eles confeccionaram o meu bouquet e ficou tão lindo, do jeito que eu imaginava!De lá pra cá a empresa sempre faz parte de dias comemorativos com as arranjos mais lindos e com um toque especial de carinho da Iza (Dona da Bohemian Home).! E sempre que penso em presentear alguém com flores é com a Bohemian que eu sempre conto porque sei o quanto a pessoa que irá receber vai amar assim como eu amo toda vez que recebo!', image: cintiaImage, },
];

const TestimonialsSection = () => {
    
    const staticTestimonials = testimonialsData.slice(0, 3);

    return (
        <section className="testimonials-section">
            <h2 className="section-title">O que dizem nossos clientes</h2>
            
            <div className="testimonials-static-wrapper">
                
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
            
            
        </section>
    );
};

export default TestimonialsSection;