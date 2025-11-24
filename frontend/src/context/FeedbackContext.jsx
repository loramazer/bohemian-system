// frontend/src/context/FeedbackContext.jsx
import React, { createContext, useState, useCallback, useRef, useEffect } from 'react';
import ToastContainer from '../components/Shared/ToastContainer.jsx';

export const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
    const [toast, setToast] = useState(null); 
    const timerRef = useRef(null); 
    const TIMEOUT_MS = 2000; 

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const hideToast = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setToast(null);
    }, []);

    const showToast = useCallback((message, type = 'success') => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        const newToast = { id: Date.now(), message, type };
        setToast(newToast);

        timerRef.current = setTimeout(() => {
            hideToast(); 
        }, TIMEOUT_MS);

    }, [hideToast]);

    const showCartSuccess = useCallback(() => {
        showToast('Produto adicionado ao carrinho!', 'cart'); 
    }, [showToast]);

    const showWishlistSuccess = useCallback(() => {
        showToast('Produto adicionado à lista de desejos!', 'wishlist');
    }, [showToast]);

    const showWishlistRemoved = useCallback(() => {
        showToast('Produto removido da lista de desejos.', 'wishlist-removed');
    }, [showToast]);
    

    const value = {
        showToast,
        showCartSuccess,
        showWishlistSuccess,
        showWishlistRemoved, 
        hideToast
    };

    return (
        <FeedbackContext.Provider value={value}>
            {children}
            <ToastContainer toast={toast} onClose={hideToast} />
        </FeedbackContext.Provider>
    );
};