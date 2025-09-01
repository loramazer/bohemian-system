// Em seu arquivo ProductGrid.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard.jsx';

const ProductGrid = ({ products }) => {
    return (
        <div className="product-grid-container">
            <div className="product-grid">
                {products.map(product => (
                    <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none' }}>
                        <ProductCard
                            name={product.name}
                            price={product.price}
                            oldPrice={product.oldPrice}
                            imageSrc={product.image}
                            tag={product.tag}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductGrid;