import React from 'react';
import '../../styles/Dashboard.css';

const KpiCards = ({ kpis }) => {
  return (
    <div className="kpi-cards-grid">
      {kpis.map((kpi, index) => (
        <div key={index} className="kpi-card">
          <div className="kpi-icon-placeholder"></div>
          <div className="kpi-info">
            <p className="kpi-title">{kpi.title}</p>
            <h2 className="kpi-value">{kpi.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KpiCards;