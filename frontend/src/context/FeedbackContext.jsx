// frontend/src/context/FeedbackContext.jsx
import React, { createContext, useState, useCallback, useRef, useEffect } from 'react';
import ToastContainer from '../components/Shared/ToastContainer.jsx';

export const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
    // MUDANÇA: De array 'toasts' para objeto 'toast'
    const [toast, setToast] = useState(null); 
    // NOVO: Referência para o timer do setTimeout
    const timerRef = useRef(null); 

    // NOVO: Garantir que o timer seja limpo se o componente for desmontado
    useEffect(() => {
        // Retorna uma função de limpeza
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const showToast = useCallback((message, type = 'success') => {
        // 1. Limpa o timer anterior (se houver um toast ativo)
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // 2. Define o novo toast (substitui o anterior)
        // Usamos um ID (timestamp) para forçar o React a re-renderizar o <ToastContainer>
        const newToast = { id: Date.now(), message, type };
        setToast(newToast); 

        // 3. Agenda a remoção deste novo toast e armazena a referência
        timerRef.current = setTimeout(() => {
            setToast(null); // Limpa o toast
            timerRef.current = null; // Limpa a referência do timer
        }, 3000); // 3 segundos

    }, []); // As dependências foram removidas para garantir que a função seja estável

    const showCartSuccess = useCallback(() => {
        showToast('Produto adicionado ao carrinho com sucesso!', 'cart');
    }, [showToast]);

    const showWishlistSuccess = useCallback(() => {
        showToast('Produto adicionado à lista de desejos!', 'wishlist');
    }, [showToast]);

    const value = {
        showToast,
        showCartSuccess,
        showWishlistSuccess,
    };

    return (
        <FeedbackContext.Provider value={value}>
            {children}
            {/* MUDANÇA: Passa o objeto 'toast' em vez do array 'toasts' */}
            <ToastContainer toast={toast} /> 
        </FeedbackContext.Provider>
    );
};