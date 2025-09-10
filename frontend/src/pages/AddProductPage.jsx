import React from 'react';
import { Link } from 'react-router-dom';
import ContentWrapper from '../components/ContentWrapper.jsx';
import ProductForm from '../components/Admin/ProductForm.jsx';
import ImageUpload from '../components/Admin/ImageUpload.jsx';

import '../styles/AddProductPage.css';

const AddProductPage = () => {
    return (
        <ContentWrapper>
            <main className="add-product-main">
                <div className="admin-breadcrumbs">
                    <Link to="/">Home</Link> &gt; <Link to="/dashboard">Painel</Link> &gt; <Link to="/admin/products">Produtos</Link> &gt; <span>Adicionar</span>
                </div>
                <h1 className="admin-page-title">Adicionar Novo Produto</h1>
                
    
                <div className="add-product-card-wrapper">
                    <ProductForm />
                    <ImageUpload />
                </div>
                
            </main>
        </ContentWrapper>
    );
};

export default AddProductPage;