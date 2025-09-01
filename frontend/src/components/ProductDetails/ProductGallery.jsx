import React, { useState } from 'react';
import '../../styles/ProductDetails.css';


const ProductGallery = ({ images }) => {
    // Usamos o useState para controlar qual imagem é a principal
    const [mainImage, setMainImage] = useState(images[0]);

    return (
        <div className="product-gallery">
            <div className="thumbnails">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt="Thumbnail"
                        className={`thumbnail ${mainImage === img ? 'active' : ''}`}
                        // A função onClick atualiza a imagem principal
                        onClick={() => setMainImage(img)}
                    />
                ))}
            </div>
            <div className="main-image-container">
                <img src={mainImage} alt="Produto em destaque" className="main-image" />
            </div>
        </div>
    );
};

export default ProductGallery;