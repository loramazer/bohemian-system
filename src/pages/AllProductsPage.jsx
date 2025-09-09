import React from 'react';
import ContentWrapper from '../components/ContentWrapper.jsx';

const AllProductsPage = () => {
    return (
        <ContentWrapper>
            <main>
                <div className="page-header">
                    <h2>Todos os Produtos</h2>
                </div>
                <p>Esta é a página de listagem de todos os produtos. A lógica de exibição de produtos será implementada aqui.</p>
            </main>
        </ContentWrapper>
    );
};

export default AllProductsPage;