// frontend/src/components/Shared/ToastContainer.jsx

import React from 'react';
import { FaCheckCircle, FaHeart, FaShoppingCart } from 'react-icons/fa';
import '../../styles/ToastContainer.css';

const IconMap = {
    success: FaCheckCircle,
    cart: FaShoppingCart,
    wishlist: FaHeart,
    // Você pode adicionar mais tipos, como 'error', 'info', etc.
};

// MUDANÇA: Recebe 'toast' (objeto) em vez de 'toasts' (array)
const ToastContainer = ({ toast }) => { 
    
    // Se não houver toast ativo, não renderiza nada
    if (!toast) {
        return null;
    }

    const IconComponent = IconMap[toast.type] || IconMap.success;
    
    return (
        <div className="toast-container-wrapper">
            {/* Renderiza apenas o toast ativo */}
            <div 
                key={toast.id} // Usa o ID (timestamp) como chave
                className={`toast-notification toast-${toast.type}`}
            >
                <IconComponent className="toast-icon" />
                <span className="toast-message">{toast.message}</span>
            </div>
        </div>
    );
};

export default ToastContainer;