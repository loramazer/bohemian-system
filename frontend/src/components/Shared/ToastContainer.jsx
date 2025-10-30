// frontend/src/components/Shared/ToastContainer.jsx

import React from 'react';
// IMPORTAÇÃO CORRIGIDA: FaTimes para o ícone 'x'
import { FaCheckCircle, FaHeart, FaShoppingCart, FaTimes } from 'react-icons/fa';
import '../../styles/ToastContainer.css';

const IconMap = {
    success: FaCheckCircle,
    cart: FaShoppingCart,
    wishlist: FaHeart,
    'wishlist-removed': FaHeart, // Pode usar o mesmo ícone ou outro
};

// MUDANÇA: Recebe 'toast' (objeto) e a função 'onClose'
const ToastContainer = ({ toast, onClose }) => {

    if (!toast) {
        return null;
    }

    const IconComponent = IconMap[toast.type] || IconMap.success;

    return (
        <div className="toast-container-wrapper">
            <div
                key={toast.id}
                className={`toast-notification toast-${toast.type}`}
            >
                <IconComponent className="toast-icon" />
                <span className="toast-message">{toast.message}</span>
                {/* BOTÃO FECHAR ADICIONADO */}
                <button onClick={onClose} className="toast-close-btn">
                    <FaTimes /> {/* Ícone 'x' */}
                </button>
            </div>
        </div>
    );
};

export default ToastContainer;