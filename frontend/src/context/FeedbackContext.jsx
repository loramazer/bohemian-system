// frontend/src/context/FeedbackContext.jsx
import React, { createContext, useState, useCallback, useRef, useEffect } from 'react';
import ToastContainer from '../components/Shared/ToastContainer.jsx';

export const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
    const [toast, setToast] = useState(null); 
    const timerRef = useRef(null); 
    const TIMEOUT_MS = 3000; // 3 segundos

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const showToast = useCallback((message, type = 'success') => {
        
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        const newToast = { id: Date.now(), message, type };
        setToast(newToast); 

        timerRef.current = setTimeout(() => {
            setToast(null); 
            timerRef.current = null; 
        }, TIMEOUT_MS);

    }, []); 

    const showCartSuccess = useCallback(() => {
        showToast('Produto adicionado ao carrinho!', 'cart'); // Mensagem simplificada
    }, [showToast]);

    const showWishlistSuccess = useCallback(() => {
        showToast('Produto adicionado à lista de desejos!', 'wishlist');
    }, [showToast]);

    // --- NOVO ---
    // Função para o toast de remoção
    const showWishlistRemoved = useCallback(() => {
        showToast('Produto removido da lista de desejos.', 'wishlist-removed');
    }, [showToast]);
    // ------------

    const value = {
        showToast,
        showCartSuccess,
        showWishlistSuccess,
        showWishlistRemoved // NOVO: Exporta a função
    };

    return (
        <FeedbackContext.Provider value={value}>
            {children}
            <ToastContainer toast={toast} /> 
        </FeedbackContext.Provider>
    );
};