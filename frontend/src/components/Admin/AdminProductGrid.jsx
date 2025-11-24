// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/components/Admin/AdminProductGrid.jsx
import React from 'react';
import AdminProductCard from './AdminProductCard.jsx';
import '../../styles/AllProductsPage.css'; 

const AdminProductGrid = ({ products, onEdit, onToggleStatus }) => {
    return (
        <div className="product-grid"> 
            {products.map(product => (
                <AdminProductCard
                    key={product.id_produto}
                    product={product}
                    onEdit={() => onEdit(product.id_produto)}
                    onToggleStatus={onToggleStatus}
                />
            ))}
        </div>
    );
};

export default AdminProductGrid;