// src/components/ProductDetails/ProductTabs.jsx

import React from 'react';
//import '../../styles/ProductDetails.css';

// 1. Receba 'product' como uma prop
const ProductTabs = ({ product }) => {

    // 2. Removemos o 'useState' e a função 'renderContent',
    //    pois não há mais abas para gerenciar.

    return (
        <div className="product-tabs-container">

            {/* 3. O 'tabs-header' (botões) foi removido. */}

            {/* 4. Renderiza o conteúdo da descrição diretamente */}
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