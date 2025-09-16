// src/components/ProductDetails/ProductGallery.jsx

import React from 'react';
import '../../styles/ProductDetails.css';

const ProductGallery = ({ product }) => {
    // Verifica se existe a URL da imagem antes de tentar renderizá-la
    const mainImage = product.imagem_url;

    return (
        <div className="product-gallery">
            <div className="main-image-container">
                {mainImage ? (
                    <img src={mainImage} alt={product.nome} className="main-image" />
                ) : (
                    <div className="main-image-placeholder">Imagem não disponível</div>
                )}
            </div>
        </div>
    );
};

export default ProductGallery;