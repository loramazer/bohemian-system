import React from 'react';
import TestimonialCard from './TestimonialCard.jsx';
import placeholderImage from '../assets/placeholder-person.png'; // Use o caminho da sua imagem

const testimonialsData = [
    {
        id: 1,
        name: 'Leonardo Luiz',
        tag: 'Padapadóca',
        text: 'More off this less hello samlande lied much over tightly circa horse taped mightly',
        image: placeholderImage,
    },
    {
        id: 2,
        name: 'Leonardo Luiz',
        tag: 'Padapadóca',
        text: 'More off this less hello samlande lied much over tightly circa horse taped mightly',
        image: placeholderImage,
    },
    {
        id: 3,
        name: 'Leonardo Luiz',
        tag: 'Padapadóca',
        text: 'More off this less hello samlande lied much over tightly circa horse taped mightly',
        image: placeholderImage,
    },
];

const TestimonialsSection = () => {
    return (
        <section className="testimonials-section">
            <h2 className="section-title">Depoimentos</h2>
            <div className="testimonials-grid">
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
        </section>
    );
};

export default TestimonialsSection;