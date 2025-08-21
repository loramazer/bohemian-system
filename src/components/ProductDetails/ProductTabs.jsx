import React, { useState } from 'react';
import '../../styles/ProductDetails.css';

const ProductTabs = () => {
    const [activeTab, setActiveTab] = useState('description');

    const renderContent = () => {
        switch (activeTab) {
            case 'description':
                return (
                    <div className="tab-content">
                        <h3>Sobre o Produto:</h3>
                        <p>Aliquam dis vulputate integer sagittis. Faucibus dis diam arcu, nulla lobortis justo netus dis. Eu in fringilla vulputate nunc nec. Dui, massa viverra...</p>
                        <h3>Mais Detalhes:</h3>
                        <ul>
                            <li>Aliquam dis vulputate integer sagittis...</li>
                            <li>Aliquam dis vulputate integer sagittis...</li>
                        </ul>
                    </div>
                );
            case 'additional':
                return <div className="tab-content">Informações adicionais sobre o produto.</div>;
            case 'comments':
                return <div className="tab-content">Comentários e avaliações dos clientes.</div>;
            default:
                return null;
        }
    };

    return (
        <div className="product-tabs-container">
            <div className="tabs-header">
                <button className={`tab-button ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Descrição</button>
                <button className={`tab-button ${activeTab === 'additional' ? 'active' : ''}`} onClick={() => setActiveTab('additional')}>Informações Adicionais</button>
                <button className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => setActiveTab('comments')}>Comentários</button>
            </div>
            {renderContent()}
        </div>
    );
};

export default ProductTabs;