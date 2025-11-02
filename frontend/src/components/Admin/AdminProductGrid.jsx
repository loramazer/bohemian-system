// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/components/Admin/AdminProductGrid.jsx
import React from 'react';
import AdminProductCard from './AdminProductCard.jsx';
import '../../styles/AllProductsPage.css'; // Reutiliza o estilo .product-grid

const AdminProductGrid = ({ products, onEdit, onDelete }) => {
    return (
        // A classe 'product-grid' já está estilizada no seu AllProductsPage.css
        <div className="product-grid"> 
            {products.map(product => (
                <AdminProductCard
                    key={product.id_produto}
                    product={product}
                    onEdit={() => onEdit(product.id_produto)}
                    onDelete={() => onDelete(product)}
                />
            ))}
        </div>
    );
};

export default AdminProductGrid;