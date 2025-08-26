import React from 'react';
import '../../styles/Dashboard.css';

const SalesChart = () => {
  return (
    <div className="sales-chart-container">
      <div className="chart-header">
        <h3>Gráfico Vendas</h3>
        <div className="chart-controls">
          <button className="chart-btn active">Semana</button>
          <button className="chart-btn">Mês</button>
          <button className="chart-btn">Ano</button>
        </div>
      </div>
      <div className="chart-placeholder">
       
        <p>Placeholder para o gráfico</p>
      </div>
    </div>
  );
};

export default SalesChart;