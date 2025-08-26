import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ContentWrapper from '../components/ContentWrapper.jsx';
import ProductInfo from '../components/ProductDetails/ProductInfo.jsx';
import ProductGallery from '../components/ProductDetails/ProductGallery.jsx';
import ProductTabs from '../components/ProductDetails/ProductTabs.jsx';

// Importe as imagens locais que você já tem na pasta assets
import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';

import '../styles/ProductDetailsPage.css';

// Dados do produto com imagens locais
const productData = {
    id: '1',
    name: 'Bohemian Glass',
    price: 'R$260',
    oldPrice: 'R$320',
    rating: 4,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magna in est adipiscing in phasellus non in justo.',
    images: [img1, img2, img3, img4], // Use as imagens importadas
    colors: ['#8e94f2', '#6a493b', '#a4d4c5']
};

const ProductDetailsPage = () => {
    const { productId } = useParams();

    return (
        <ContentWrapper>
            <main className="product-details-main">
                <div className="product-breadcrumbs">
                    <Link to="/">Home</Link> &gt; <Link to="/products">Comprar</Link> &gt; <span>{productData.name}</span>
                </div>
                <div className="product-details-layout">
                    <ProductGallery images={productData.images} />
                    <ProductInfo product={productData} />
                </div>
                <ProductTabs />
            </main>
        </ContentWrapper>
    );
};

export default ProductDetailsPage;