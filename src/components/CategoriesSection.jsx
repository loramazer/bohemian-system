import React, { useState } from 'react';
import ProductCard from './ProductCard.jsx';
import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';

const IMAGES = [img1, img2, img3, img4, img5];

const categories = {
    'novidades': [
        { id: 5, name: 'Box Flores Mistas', price: 'R$270', oldPrice: 'R$290', image: img1, tag: null },
        { id: 6, name: 'Wine Box + Lindt', price: 'R$140', oldPrice: 'R$160', image: img2, tag: 'Sale' },
        { id: 7, name: 'Box Mistas + Frisante', price: 'R$340', oldPrice: null, image: img3, tag: null },
    ],
    'mais-vendidos': [
        { id: 8, name: 'Box Flores Mistas', price: 'R$270', oldPrice: 'R$290', image: img4, tag: null },
        { id: 9, name: 'Box Flores Mistas', price: 'R$270', oldPrice: null, image: img5, tag: null },
        { id: 10, name: 'Box Flores Mistas', price: 'R$270', oldPrice: null, image: img1, tag: null },
    ],
    'dia-dos-namorados': [],
    'ofertas': [],
};

const CategoriesSection = () => {
    const [activeTab, setActiveTab] = useState('novidades');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <section className="categories-section">
            <h2 className="section-title">Categorias</h2>
            <div className="categories-tabs">
                <button className={`tab-button ${activeTab === 'novidades' ? 'active' : ''}`} onClick={() => handleTabClick('novidades')}>Novidades</button>
                <button className={`tab-button ${activeTab === 'mais-vendidos' ? 'active' : ''}`} onClick={() => handleTabClick('mais-vendidos')}>Mais Vendidos</button>
                <button className={`tab-button ${activeTab === 'dia-dos-namorados' ? 'active' : ''}`} onClick={() => handleTabClick('dia-dos-namorados')}>Dia dos Namorados</button>
                <button className={`tab-button ${activeTab === 'ofertas' ? 'active' : ''}`} onClick={() => handleTabClick('ofertas')}>Ofertas</button>
            </div>
            <div className="products-grid">
                {categories[activeTab].map((product, index) => (
                    <ProductCard
                        key={product.id}
                        name={product.name}
                        price={product.price}
                        oldPrice={product.oldPrice}
                        imageSrc={IMAGES[index % IMAGES.length]}
                        tag={product.tag}
                    />
                ))}
            </div>
        </section>
    );
};

export default CategoriesSection;