// src/components/ProductDetails/ProductTabs.jsx

import React from 'react';
//import '../../styles/ProductDetails.css';

// 1. Receba 'product' como uma prop
const ProductTabs = ({ product }) => {

    return (
        // CORREÇÃO: Renomeia a classe para não conflitar com a seção pai
        <div className="product-tabs-content"> 

            <div className="tab-content">
                <h3>Sobre o Produto:</h3>

                {/* 5. Puxa a descrição do objeto 'product' vindo da API */}
                <p>{product.descricao}</p>

                {/* A lista <ul> estática foi removida */}
            </div>
        </div>
    );
};

export default ProductTabs;