import React from 'react';
import { Link } from 'react-router-dom';

const ProductGrid = ({ products, cardComponent: CardComponent }) => {
    return (
        <div className="product-grid-container">
            <div className="product-grid">
                {products.map(product => (
                    <CardComponent
                        key={product.id}
                        {...product}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductGrid;