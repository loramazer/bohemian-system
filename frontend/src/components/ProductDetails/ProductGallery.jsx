import React, { useState, useEffect } from 'react'; 


const ProductGallery = ({ product }) => {
    let imageUrls = [];
    if (product && product.imagem_url) {
        try {
            const parsed = JSON.parse(product.imagem_url);
            if (Array.isArray(parsed)) {
                imageUrls = parsed;
            } else if (typeof product.imagem_url === 'string') {
                
                imageUrls = [product.imagem_url]; 
            }
        } catch (e) {
            imageUrls = [product.imagem_url];
        }
    }
    
    const placeholderImage = 'https://via.placeholder.com/600x600?text=Sem+Imagem';
    const [mainImage, setMainImage] = useState(imageUrls.length > 0 ? imageUrls[0] : placeholderImage);

    useEffect(() => {
        const initialImage = imageUrls.length > 0 ? imageUrls[0] : placeholderImage;
        setMainImage(initialImage);
    }, [product.id_produto, product.imagem_url]);


    const handleDoubleClick = () => {
        if (product && product.id_produto) {
            navigate(`/produto/${product.id_produto}`);
        }
    };

    return (
        <div className="product-gallery">
            
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

            <div className="main-image-container">
                <img 
                    src={mainImage} 
                    alt={product.nome} 
                    className="main-image" 
                />
            </div>
        </div>
    );
};

export default ProductGallery;