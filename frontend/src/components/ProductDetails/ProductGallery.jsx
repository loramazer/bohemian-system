// src/components/ProductDetails/ProductGallery.jsx

import React, { useState, useEffect } from 'react'; // NOVO: Importa useState, useEffect
import '../../styles/ProductDetails.css';

const ProductGallery = ({ product }) => {
    // 1. Decodifica a string JSON de URLs
    let imageUrls = [];
    try {
        // Verifica se a URL é uma string JSON válida (ou um único link)
        if (product.imagem_url) {
            const parsed = JSON.parse(product.imagem_url);
            if (Array.isArray(parsed)) {
                imageUrls = parsed;
            } else {
                imageUrls = [product.imagem_url]; // Trata caso seja apenas uma string (legado)
            }
        }
    } catch (e) {
        // Se a tentativa de parse falhar, assume que é uma URL única simples
        imageUrls = product.imagem_url ? [product.imagem_url] : [];
    }
    
    // Estado para a imagem principal selecionada
    const [mainImage, setMainImage] = useState(imageUrls.length > 0 ? imageUrls[0] : null);

    // Efeito para resetar a imagem principal se o produto mudar
    useEffect(() => {
        setMainImage(imageUrls.length > 0 ? imageUrls[0] : null);
    }, [product.id_produto]);

    const placeholderImage = 'https://via.placeholder.com/600x600?text=Imagem+N%C3%A3o+Dispon%C3%ADvel';

    return (
        <div className="product-gallery">
            
            {/* THUMBNAILS (GALERIA) */}
            {imageUrls.length > 1 && (
                <div className="thumbnails">
                    {imageUrls.map((url, index) => (
                        <img 
                            key={index}
                            src={url} 
                            alt={`${product.nome} thumbnail ${index + 1}`} 
                            className={`thumbnail ${url === mainImage ? 'active' : ''}`} 
                            onClick={() => setMainImage(url)} 
                        />
                    ))}
                </div>
            )}
            
            {/* IMAGEM PRINCIPAL */}
            <div className="main-image-container">
                <img 
                    src={mainImage || placeholderImage} 
                    alt={product.nome} 
                    className="main-image" 
                />
            </div>
        </div>
    );
};

export default ProductGallery;