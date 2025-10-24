import React from 'react';
import '../../styles/Footer.css';
// 🔑 CORREÇÃO CRÍTICA 1: Importe a imagem como um módulo.
// Assumindo que a logo está no caminho 'src/assets/bohemian-logo.png'
import logo from '../../assets/bohemian-logo.png'; 

const Footer = () => {
    const whatsappNumber = '5542999583432';
    const whatsappLink = `https://wa.me/${whatsappNumber}`;
    
    // 🔑 MELHORIA: Use o mesmo endereço para a variável e o link
    const address = 'Rua Marechal Deodoro da Fonseca, 51, Centro, Ponta Grossa, PR, 84010-030';

    // 🔑 CORREÇÃO CRÍTICA 2: Formato correto para o link de pesquisa do Google Maps.
    // Use 'https://www.google.com/maps/search/' e codifique o endereço.
    const mapsLink = `https://www.google.com/maps/search/${encodeURIComponent(address)}`;

    return (
        <footer className="main-footer-minimal">
            <div className="footer-signature-content">
                
                {/* 🔑 CORREÇÃO 3: Use a variável importada para o src da imagem */}
                <img src={logo} alt="Bohemian Home Floral Decor Logo" className="footer-logo-minimal" />
                
                <div className="contact-details-minimal">
                    
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="contact-item whatsapp-link">
                        <strong>Telefone:</strong> (42) 99958-3432
                    </a>
                    
                    <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="contact-item maps-link">
                        <strong>Endereço:</strong> R. Mal. Deodoro da Fonseca, 51 - Centro, Ponta Grossa - PR, 84010-030
                    </a>
                </div>
            </div>
            
            <div className="footer-bottom-minimal">
                <p>©Webecy - All Rights Reserved</p>
            </div>
        </footer>
    );
};

export default Footer;