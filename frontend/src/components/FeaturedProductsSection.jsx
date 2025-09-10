import React from 'react';
import ProductCard from './ProductCard.jsx';
import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';

const IMAGES = [img1, img2, img3, img4, img5];

const featuredProducts = [
    { id: 1, name: 'Cone de Flores', code: '132301', price: 'R$99,00', tag: null },
    { id: 2, name: 'Bohemian Glass', code: '151230', price: 'R$129,00', tag: 'New' },
    { id: 3, name: 'Rosa com Lindt', code: '122201', price: 'R$42,00', tag: null },
    { id: 4, name: 'Mini Desidratado', code: '152201', price: 'R$59,00', tag: null },
];

const FeaturedProductsSection = () => {
    return (
        <section className="featured-products">
            <h2 className="section-title">Produtos em Destaque</h2>
            <div className="products-grid">
                {featuredProducts.map((product, index) => (
                    <ProductCard
                        key={product.id}
                        name={product.name}
                        code={product.code}
                        price={product.price}
                        imageSrc={IMAGES[index % IMAGES.length]}
                        tag={product.tag}
                    />
                ))}
            </div>
        </section>
    );
};

export default FeaturedProductsSection;