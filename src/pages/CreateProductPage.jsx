import React from 'react';
import ContentWrapper from '../components/ContentWrapper.jsx';
import ProductForm from '../components/Catalog/ProductForm.jsx'; // Importa o componente do formulário

const CreateProductPage = () => {
    return (
        <ContentWrapper>
            <main>
                <div className="page-header">
                    <h2>Adicionar Novo Produto</h2>
                </div>
                <ProductForm />
            </main>
        </ContentWrapper>
    );
};

export default CreateProductPage;