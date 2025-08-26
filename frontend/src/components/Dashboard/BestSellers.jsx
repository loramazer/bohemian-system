import React from 'react';
import '../../styles/Dashboard.css';


const BestSellers = ({ bestSellers }) => {
  return (
    <div className="best-sellers-container">
      <div className="best-sellers-header">
        <h3>Best Sellers</h3>
        <button className="export-btn">EXPORTAR</button>
      </div>
      <div className="best-sellers-list">
        {bestSellers.map((seller, index) => (
          <div key={index} className="seller-item">
            <div className="seller-image-placeholder"></div>
            <div className="seller-details">
              <p className="seller-name">{seller.name}</p>
              <p className="seller-price">{seller.price}</p>
              <p className="seller-sales">{seller.sales}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;