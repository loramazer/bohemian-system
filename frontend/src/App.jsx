import React, { useState, useEffect } from 'react'; 
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
import EditProductPage from './pages/EditProductPage.jsx'; 
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
import MinhaContaPage from './pages/MinhaContaPage.jsx';
import PaginaSucesso from './pages/PaginaSucesso.jsx';
import HelpModal from './components/Shared/HelpModal.jsx';

import './styles/App.css';

function App() {

  const [isHelpVisible, setIsHelpVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'F1') {
        event.preventDefault(); 
        setIsHelpVisible((prev) => !prev);
      }
      
      if (event.key === 'Escape' && isHelpVisible) {
        event.preventDefault();
        setIsHelpVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHelpVisible]); 

  return (
    <div className="app-container">
        <Header />
        <ScrollToTop />
        <Routes>
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
            <Route path="/admin/products/edit/:productId" element={<EditProductPage />} />
            <Route path="/admin/orders/:orderId" element={<OrderDetailPage />} />
            <Route path="/admin/orders" element={<AllOrdersPage />} />
            
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/meus-pedidos" element={<UserOrderPage />} />
            <Route path="/minha-conta" element={<MinhaContaPage />} />
		        <Route path="/pedido/sucesso" element={<PaginaSucesso />} />
        </Routes>
        <Footer />

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <HelpModal 
        isVisible={isHelpVisible} 
        onClose={() => setIsHelpVisible(false)} 
      />
    </div>
  );
}

export default App;