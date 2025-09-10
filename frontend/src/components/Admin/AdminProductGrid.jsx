import React from 'react';
import AdminProductCard from './AdminProductCard.jsx';
import '../../styles/AllProductsPage.css';

const AdminProductGrid = ({ products }) => {
    return (
        // A classe deve ser 'product-grid' para corresponder ao CSS
        <div className="product-grid"> 
            {products.map(product => (
                <AdminProductCard
                    key={product.id}
                    {...product}
                />
            ))}
        </div>
    );
};

export default AdminProductGrid;