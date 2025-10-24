import React from 'react';
import '../../styles/Dashboard.css';

const BestSellers = ({ bestSellers }) => {
  const handleExport = () => {
    if (!bestSellers || bestSellers.length === 0) {
      alert('Nenhum dado para exportar.');
      return;
    }

    const headers = ['Nome do Produto', 'Total de Vendas'];
    const csvContent = [
      headers.join(';'),
      ...bestSellers.map(seller => `${seller.nome};${seller.total_vendido}`)
    ].join('\n');

    const csvWithBOM = '\uFEFF' + csvContent; 
    
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'best-sellers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="best-sellers-container">
      <div className="best-sellers-header">
        <h3>Best Sellers</h3>
        <button onClick={handleExport} className="export-btn">EXPORTAR</button>
      </div>
      <div className="best-sellers-list">
        {bestSellers.map((seller, index) => (
          <div key={index} className="seller-item">
            <div className="seller-image-placeholder"></div>
            <div className="seller-details">
              <p className="seller-name">{seller.nome}</p>
              <p className="seller-sales">{seller.total_vendido} vendas</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;