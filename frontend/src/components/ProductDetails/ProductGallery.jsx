// src/components/ProductDetails/ProductGallery.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. IMPORTE O useNavigate
import '../../styles/ProductDetails.css';

const ProductGallery = ({ product }) => {
    const navigate = useNavigate(); // Instancia o hook

    // ... (toda a sua lógica de 'imageUrls' e 'useState' continua igual)
    let imageUrls = [];
    try {
        if (product.imagem_url) {
            const parsed = JSON.parse(product.imagem_url);
            if (Array.isArray(parsed)) {
                imageUrls = parsed;
            } else {
                imageUrls = [product.imagem_url];
            }
        }
    } catch (e) {
        imageUrls = product.imagem_url ? [product.imagem_url] : [];
    }

    const [mainImage, setMainImage] = useState(imageUrls.length > 0 ? imageUrls[0] : null);

    useEffect(() => {
        setMainImage(imageUrls.length > 0 ? imageUrls[0] : null);
        // Corrigindo a dependência para também ouvir 'imageUrls'
    }, [product.id_produto, imageUrls]);

    const placeholderImage = 'https://via.placeholder.com/600x600?text=Imagem+N%C3%A3o+Dispon%C3%ADvel';

    // 2. CRIE A FUNÇÃO DE NAVEGAÇÃO
    const handleDoubleClick = () => {
        // Garante que o produto e o ID existam antes de navegar
        if (product && product.id_produto) {
            // Ajuste a rota se for diferente (ex: /produtos/nome-do-produto)
            navigate(`/produto/${product.id_produto}`);
        }
    };

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
                    // 3. ADICIONE O EVENTO 'onDoubleClick'
                    onDoubleClick={handleDoubleClick}
                />
            </div>
        </div>
    );
};

export default ProductGallery;