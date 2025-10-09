// src/components/Catalog/ProductGrid.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../Shared/ProductCard.jsx';
import '../../styles/ProductGrid.css';

const ProductGrid = ({ products }) => {
    return (
        <div className="product-grid-container">
            <div className="product-grid">
                {products && products.length > 0 ? (
                    products.map(product => (
                        <Link to={`/product/${product.id_produto}`} key={product.id_produto} style={{ textDecoration: 'none' }}>
                            {/* CORREÇÃO: Passa o objeto 'product' inteiro, como esperado pelo ProductCard */}
                            <ProductCard product={product} />
                        </Link>
                    ))
                ) : (
                    <p>Nenhum produto encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default ProductGrid;