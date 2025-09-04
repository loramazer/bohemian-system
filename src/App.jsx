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
import CreateProductPage from './pages/CreateProductPage.jsx'; // Importe o novo componente

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
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-product" element={<CreateProductPage />} /> {/* Adicione a nova rota */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;