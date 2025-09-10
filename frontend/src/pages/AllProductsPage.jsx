// src/pages/AllProductsPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import ContentWrapper from '../components/ContentWrapper.jsx';
import AdminProductGrid from '../components/Admin/AdminProductGrid.jsx'; // Importe o novo componente AdminProductGrid
// Importe as imagens locais que você já tem na pasta assets
import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';

import '../styles/AllProductsPage.css';

const IMAGES = [img1, img2, img3, img4, img5];

const adminProductData = [
    { id: 1, name: 'Bohemian Glass', price: 'R$260', description: 'Lorem ipsum...', image: IMAGES[0], sold: 1269, goal: 1289 },
    { id: 2, name: 'Bohemian Glass', price: 'R$260', description: 'Lorem ipsum...', image: IMAGES[1], sold: 1269, goal: 2000 },
    { id: 3, name: 'Bohemian Glass', price: 'R$260', description: 'Lorem ipsum...', image: IMAGES[2], sold: 1269, goal: 1289 },
    { id: 4, name: 'Bohemian Glass', price: 'R$260', description: 'Lorem ipsum...', image: IMAGES[3], sold: 1269, goal: 1289 },
    { id: 5, name: 'Bohemian Glass', price: 'R$260', description: 'Lorem ipsum...', image: IMAGES[4], sold: 1269, goal: 1289 },
    { id: 6, name: 'Bohemian Glass', price: 'R$260', description: 'Lorem ipsum...', image: IMAGES[0], sold: 1269, goal: 1289 },
];

const AllProductsPage = () => {
    return (
        <ContentWrapper>
            <main className="admin-products-main">
                <div className="admin-breadcrumbs">
                    <Link to="/">Home</Link> &gt; <Link to="/dashboard">Painel</Link> &gt; <span>Produtos</span>
                </div>
                <div className="admin-page-header">
                    <h1 className="admin-page-title">Todos Produtos</h1>
                    <Link to="/admin/products/add" className="add-product-btn">ADD NOVO PRODUTO</Link>
                </div>
              
                <AdminProductGrid products={adminProductData} />
            </main>
        </ContentWrapper>
    );
};

export default AllProductsPage;