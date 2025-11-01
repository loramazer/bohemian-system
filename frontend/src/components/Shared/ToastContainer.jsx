// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/components/Shared/ToastContainer.jsx

import React from 'react';
// *** CORREÇÃO AQUI: Adicionar FaExclamationTriangle ***
import { FaCheckCircle, FaHeart, FaShoppingCart, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import '../../styles/ToastContainer.css';

// *** CORREÇÃO AQUI: Adicionar o novo ícone ao map ***
const IconMap = {
    success: FaCheckCircle,
    cart: FaShoppingCart,
    wishlist: FaHeart,
    'wishlist-removed': FaHeart,
    'warning': FaExclamationTriangle // <-- NOVO TIPO
};

const ToastContainer = ({ toast, onClose }) => {

    if (!toast) {
        return null;
    }

    const IconComponent = IconMap[toast.type] || IconMap.success;

    return (
        <div className="toast-container-wrapper">
            <div
                key={toast.id}
                // *** CORREÇÃO AQUI: O CSS usará 'toast-warning' ***
                className={`toast-notification toast-${toast.type}`} 
            >
                <IconComponent className="toast-icon" />
                <span className="toast-message">{toast.message}</span>
                <button onClick={onClose} className="toast-close-btn">
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};

export default ToastContainer;