// frontend/src/components/Shared/TestimonialCard.jsx

import React from 'react';
import { FaFeatherAlt } from 'react-icons/fa';
import '../../styles/TestimonialCard.css'; // Garantir que o CSS está linkado

const TestimonialCard = ({ imageSrc, name, text, tag }) => {
    return (
        <div className="testimonial-card">
            <div className="testimonial-image-container">
                <img src={imageSrc} alt={`Foto de ${name}`} className="testimonial-image" />
            </div>
            <div className="testimonial-info">
                <p className="testimonial-tag">
                    <FaFeatherAlt className="tag-icon" /> {tag}
                </p>
                <h3 className="testimonial-name">{name}</h3>
                <p className="testimonial-text">{text}</p>
                {/* O link 'Ler Mais' FOI REMOVIDO daqui */}
            </div>
        </div>
    );
};

export default TestimonialCard;