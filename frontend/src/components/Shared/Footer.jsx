import React from 'react';
import '../../styles/Footer.css';
import logo from '../../../public/bohemian-logo.png'; 

const Footer = () => {
    const whatsappNumber = '5542999583432';
    const whatsappLink = `https://wa.me/${whatsappNumber}`;
    
    const address = 'Rua Marechal Deodoro da Fonseca, 51, Centro, Ponta Grossa, PR, 84010-030';

    
    const mapsLink = `https://www.google.com/maps/search/${encodeURIComponent(address)}`;

    return (
        <footer className="main-footer-minimal">
            <div className="footer-signature-content">
                
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