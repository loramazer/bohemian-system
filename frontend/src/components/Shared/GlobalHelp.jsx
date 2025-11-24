import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import HelpPopup from '../HelpPoupup.jsx';
import useHelpContext from '../hooks/useHelpContext.js';

const GlobalHelp = () => {
    const location = useLocation();
    const path = location.pathname;


    const pageName = useMemo(() => {
        if (path === '/dashboard') return 'AdminDashboardPage';
        if (path === '/admin/products/add') return 'AddProductPage';
        if (path.includes('/admin/products/edit')) return 'EditProductPage';
        if (path === '/admin/products') return 'AdminProductsPage';
        if (path.includes('/admin/orders/')) return 'OrderDetailPage';
        if (path === '/admin/orders') return 'AdminOrdersPage';

        if (path === '/') return 'HomePage';
        if (path === '/login') return 'LoginPage';
        if (path === '/register') return 'RegisterPage';
        if (path === '/forgot-password') return 'ForgotPasswordPage';

        if (path === '/products') return 'CatalogPage';
        if (path.includes('/product/')) return 'ProductDetailsPage';

        if (path === '/cart') return 'CartPage';
        if (path === '/checkout') return 'CheckoutPage';
        if (path === '/pedido/sucesso') return 'OrderConfirmedPage';

        if (path === '/meus-pedidos') return 'UserOrdersPage';
        if (path === '/minha-conta') return 'UserProfilePage';
        if (path === '/wishlist') return 'WishlistPage';

        if (path === '/sobre-nos') return 'AboutPage';
        if (path === '/contato') return 'ContactPage';

        return 'Default';
    }, [path]);

    const helpContent = useHelpContext(pageName);

    return (
        <HelpPopup
            title={helpContent.title}
            content={helpContent.content}
        />
    );
};

export default GlobalHelp;