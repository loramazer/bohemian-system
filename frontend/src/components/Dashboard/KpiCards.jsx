// frontend/src/components/Dashboard/KpiCards.jsx
import React from 'react';
import { FaShoppingCart, FaCalendarCheck, FaBoxOpen, FaClock } from 'react-icons/fa'; // Importa ícones
import '../../styles/Dashboard.css';

const iconMap = {
    'Total Pedidos': FaShoppingCart,
    'Pedidos Ativos': FaBoxOpen,
    'Pedidos Fechados': FaCalendarCheck,
    'Pedidos Previstos': FaClock,
};

const KpiCards = ({ kpis }) => {
  return (
    <div className="kpi-cards-grid">
      {kpis.map((kpi, index) => {
        const IconComponent = iconMap[kpi.title]; // Seleciona o ícone

        return (
          <div key={index} className="kpi-card">
            {/* Substitui o placeholder de div vazia pelo componente de ícone */}
            <div className="kpi-icon-placeholder">
                {IconComponent && <IconComponent size={24} color="#5d7a7b" />}
            </div>
            <div className="kpi-info">
              <p className="kpi-title">{kpi.title}</p>
              <h2 className="kpi-value">{kpi.value}</h2>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KpiCards;