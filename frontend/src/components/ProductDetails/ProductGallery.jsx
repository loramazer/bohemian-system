import React, { useState, useEffect } from 'react'; 


const ProductGallery = ({ product }) => {
    // 1. Lógica robusta para decodificar a URL:
    let imageUrls = [];
    if (product && product.imagem_url) {
        try {
            const parsed = JSON.parse(product.imagem_url);
            if (Array.isArray(parsed)) {
                imageUrls = parsed;
            } else if (typeof product.imagem_url === 'string') {
                // Trata caso seja uma URL única (legado)
                imageUrls = [product.imagem_url]; 
            }
        } catch (e) {
            // Se o parse JSON falhar (ex: é uma URL simples que não está em array)
            imageUrls = [product.imagem_url];
        }
    }
    
    const placeholderImage = 'https://via.placeholder.com/600x600?text=Sem+Imagem';
    
    // 2. Estado para a imagem principal selecionada, com fallback para o placeholder
    const [mainImage, setMainImage] = useState(imageUrls.length > 0 ? imageUrls[0] : placeholderImage);

    // 3. Efeito para resetar a imagem principal se o produto mudar
    useEffect(() => {
        const initialImage = imageUrls.length > 0 ? imageUrls[0] : placeholderImage;
        setMainImage(initialImage);
    }, [product.id_produto, product.imagem_url]);


    const handleDoubleClick = () => {
        // Garante que o produto e o ID existam antes de navegar
        if (product && product.id_produto) {
            // Ajuste a rota se for diferente (ex: /produtos/nome-do-produto)
            navigate(`/produto/${product.id_produto}`);
        }
    };

    return (
        <div className="product-gallery">
            
            {/* THUMBNAILS (GALERIA) - Só mostra se houver mais de 1 imagem */}
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
                    src={mainImage} 
                    alt={product.nome} 
                    className="main-image" 
                />
            </div>
        </div>
    );
};

export default ProductGallery;