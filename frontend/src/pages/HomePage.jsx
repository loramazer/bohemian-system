import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection.jsx';
import FeaturedProductsSection from '../components/FeaturedProductsSection.jsx';
import CategoriesSection from '../components/CategoriesSection.jsx';
import TestimonialsSection from '../components/TestimonialsSection.jsx'; 
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';

import '../styles/HomePage.css';
import '../styles/FeaturedProductsSection.css';
import '../styles/TestimonialsSection.css'; 
import '../styles/TestimonialCard.css'; 
import '../styles/CategoriesSection.css';
import '../styles/ContentWrapper.css';

const HomePage = () => {
    
    const userName = localStorage.getItem('userName');

    return (
        <main>
            {/* NOVO: Envolve HeroSection dentro de ContentWrapper */}
            <ContentWrapper> 
                <HeroSection />
            </ContentWrapper>
            
            <ContentWrapper>
                {userName && (
                    <div style={{ padding: '20px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        Olá, {userName}!
                    </div>
                )}
                <FeaturedProductsSection />
                <CategoriesSection />
                <TestimonialsSection />
            </ContentWrapper>
        </main>
    );
};

export default HomePage;