import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard.jsx';
import '../../styles/ProductGrid.css';

const ProductGrid = ({ products }) => {
    return (
        <div className="product-grid-container">
            <div className="product-grid">
                {products.map(product => (
                    <Link to={`/product/${product.id}`} key={product.id} className="product-link-card">
                        <ProductCard
                            name={product.nome}
                            price={`R$${product.preco_venda}`}
                            imageSrc={product.imagem_url} // Usa a URL da imagem da API
                            tag={null}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductGrid;