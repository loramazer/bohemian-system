// loramazer/bohemian-system/bohemian-system-refatorar-organizacao/frontend/src/components/Shared/ToastContainer.jsx

import React from 'react';

import { FaCheckCircle, FaHeart, FaShoppingCart, FaTimes, FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import '../../styles/ToastContainer.css';

const IconMap = {
    success: FaCheckCircle,
    cart: FaShoppingCart,
    wishlist: FaHeart,
    'wishlist-removed': FaHeart,
    'warning': FaExclamationTriangle,
    'trash-removed': FaTrash 
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