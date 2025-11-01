import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

// --- Seus Componentes e Páginas ---
import Header from './components/Shared/Header.jsx';
import Footer from './components/Shared/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CartPage from './pages/CartPage.jsx';
import OrderConfirmedPage from './pages/OrderConfirmedPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AllProductsPage from './pages/AllProductsPage.jsx';
import AddProductPage from './pages/AddProductPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';
import AllOrdersPage from './pages/AllOrdersPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import RequireLoginPage from './pages/RequireLoginPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx'; 
import ContactPage from './pages/ContactPage.jsx'; 
import WishlistPage from './pages/WishlistPage.jsx';
import ScrollToTop from './components/Shared/ScrollToTop.jsx';
import UserOrderPage from './pages/UserOrderPage.jsx'; 


import './styles/App.css';

function App() {
  return (
    <div className="app-container">
        <Header />
        <ScrollToTop />
        <Routes>
            {/* Suas rotas ficam aqui dentro */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<CatalogPage />} />
            <Route path="/require-login" element={<RequireLoginPage />} />
            <Route path="/product/:productId" element={<ProductDetailsPage />} />
            <Route path="/sobre-nos" element={<AboutPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin/products" element={<AllProductsPage />} />
            <Route path="/admin/products/add" element={<AddProductPage />} />
            <Route path="/admin/orders/:orderId" element={<OrderDetailPage />} />
            <Route path="/admin/orders" element={<AllOrdersPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/meus-pedidos" element={<UserOrderPage />} />

        </Routes>
        <Footer />
    </div>
  );
}

export default App;