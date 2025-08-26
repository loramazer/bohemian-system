import React from 'react';
import HeroSection from '../components/HeroSection.jsx';
import FeaturedProductsSection from '../components/FeaturedProductsSection.jsx';
import CategoriesSection from '../components/CategoriesSection.jsx';
import TestimonialsSection from '../components/TestimonialsSection.jsx'; 
import ContentWrapper from '../components/ContentWrapper.jsx';

import '../styles/homepage.css';
import '../styles/FeaturedProductsSection.css';
import '../styles/TestimonialsSection.css'; 
import '../styles/TestimonialCard.css'; 
import '../styles/CategoriesSection.css';
import '../styles/ContentWrapper.css';

const HomePage = () => {
    return (
        <main>
            <HeroSection />
            <ContentWrapper>
                <FeaturedProductsSection />
                <CategoriesSection />
                <TestimonialsSection /> {/* Adicione o novo componente aqui */}
            </ContentWrapper>
        </main>
    );
};

export default HomePage;