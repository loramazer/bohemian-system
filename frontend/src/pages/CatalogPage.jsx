
import React from 'react';
import ContentWrapper from '../components/ContentWrapper.jsx';
import Sidebar from '../components/Catalog/Sidebar.jsx';
import ProductGrid from '../components/Catalog/ProductGrid.jsx';

// Importe as imagens locais que você já tem na pasta assets
import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';

import '../styles/CatalogPage.css';
import '../styles/Sidebar.css';
import '../styles/ProductGrid.css';
import '../styles/ProductCard.css';

const IMAGES = [img1, img2, img3, img4, img5];

const productData = [
    { id: 1, name: 'Bohemian Glass', price: 'R$260', oldPrice: 'R$320', description: 'Lorem ipsum dolor sit amet...', image: IMAGES[0], rating: 4 },
    { id: 2, name: 'Bohemian Glass', price: 'R$260', oldPrice: 'R$320', description: 'Lorem ipsum dolor sit amet...', image: IMAGES[1], rating: 5 },
    { id: 3, name: 'Bohemian Glass', price: 'R$260', oldPrice: 'R$320', description: 'Lorem ipsum dolor sit amet...', image: IMAGES[2], rating: 3 },
    { id: 4, name: 'Bohemian Glass', price: 'R$260', oldPrice: 'R$320', description: 'Lorem ipsum dolor sit amet...', image: IMAGES[3], rating: 4 },
    { id: 5, name: 'Bohemian Glass', price: 'R$260', oldPrice: 'R$320', description: 'Lorem ipsum dolor sit amet...', image: IMAGES[4], rating: 5 },
    { id: 6, name: 'Bohemian Glass', price: 'R$260', oldPrice: 'R$320', description: 'Lorem ipsum dolor sit amet...', image: IMAGES[0], rating: 4 },
];

const CatalogPage = () => {
    return (
        <ContentWrapper>
            <main className="catalog-main">
                <div className="page-header">
                    <h2>Comprar Produtos Bohemian</h2>
                    <div className="filter-sort-controls">
                        {/* Controles de filtro e ordenação aqui */}
                    </div>
                </div>
                <div className="catalog-layout">
                    <Sidebar />
                    <ProductGrid products={productData} />
                </div>
                
            </main>
            
        </ContentWrapper>
    );
};


export default CatalogPage;