// src/components/ProductDetails/ProductTabs.jsx

import React from 'react';
const ProductTabs = ({ product }) => {

    return (
        <div className="product-tabs-content"> 

            <div className="tab-content">
                <h3>Sobre o Produto:</h3>

                <p>{product.descricao}</p>

            </div>
        </div>
    );
};

export default ProductTabs;