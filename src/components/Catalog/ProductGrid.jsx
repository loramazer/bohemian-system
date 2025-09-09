import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard.jsx';

const ProductGrid = ({ products }) => {
    return (
        <div className="product-grid-container">
            <div className="product-grid">
                {products.map(product => (
                    <Link to={`/product/${product.id_produto}`} key={product.id_produto} style={{ textDecoration: 'none' }}>
                        <ProductCard
                            name={product.nome}
                            price={`R$${product.preco_venda}`}
                            imageSrc={product.imagem_url} 
                            tag={null}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductGrid;