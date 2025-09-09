import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CartPage from './pages/CartPage.jsx';
import OrderConfirmedPage from './pages/OrderConfirmedPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AddProductPage from './pages/AddProductPage.jsx';
import AllOrdersPage from './pages/AllOrdersPage.jsx';
import AllProductsPage from './pages/AllProductsPage.jsx';

import './styles/App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
        <Route path="/cart" element={<CartPage />} /> 
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<CatalogPage />} />
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
        <Route path="/sobre-nos" element={<AboutPage />} />

        {/* Rotas para o painel de administrador */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin/products/add" element={<AddProductPage />} />
        <Route path="/admin/products" element={<AllProductsPage />} />
        <Route path="/admin/orders" element={<AllOrdersPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;