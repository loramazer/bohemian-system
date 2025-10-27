// src/components/Shared/ScrollToTop.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    // Extrai o "pathname" (ex: "/produtos/101") do objeto de localização
    const { pathname } = useLocation();

    // Este hook useEffect será executado toda vez que o 'pathname' mudar
    useEffect(() => {
        // Rola a janela para a posição 0 (topo) na coordenada Y (vertical)
        window.scrollTo(0, 0);
    }, [pathname]); // O array de dependências garante que isso só rode quando a URL mudar

    // Este componente não renderiza nada no HTML
    return null;
}

export default ScrollToTop;