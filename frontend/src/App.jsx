import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Shared/Header.jsx'; 
import Footer from './components/Shared/Footer.jsx'; 
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AllProductsPage from './pages/AllProductsPage.jsx';
import AddProductPage from './pages/AddProductPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';
import AllOrdersPage from './pages/AllOrdersPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
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
        <Route path="/admin/products" element={<AllProductsPage />} />
        <Route path="/admin/products/add" element={<AddProductPage />} />
        <Route path="/admin/orders/:orderId" element={<OrderDetailPage />} />
        <Route path="/admin/orders" element={<AllOrdersPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;