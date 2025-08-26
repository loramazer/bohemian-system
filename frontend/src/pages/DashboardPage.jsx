import React from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import KpiCards from '../components/Dashboard/KpiCards.jsx';
import SalesChart from '../components/Dashboard/SalesChart.jsx';
import BestSellers from '../components/Dashboard/BestSellers.jsx';
import RecentOrdersTable from '../components/Dashboard/RecentOrdersTable.jsx';
import ContentWrapper from '../components/ContentWrapper.jsx';

import '../styles/Dashboard.css';

const dashboardData = {
  kpis: [
    { title: 'Total Pedidos', value: '50.000', change: '+34.7%', comparison: 'Comparado ao Mês 2024' },
    { title: 'Pedidos Ativos', value: '120', change: '↑ 34.7%', comparison: 'Comparado ao Mês 2024' },
    { title: 'Pedidos Fechados', value: '19.880', change: '↑ 34.7%', comparison: 'Comparado ao Mês 2024' },
    { title: 'Pedidos Previstos', value: '350', change: '↑ 34.7%', comparison: 'Comparado ao Mês 2024' },
  ],
  bestSellers: [
    { name: 'Lorem Ipsum', price: 'R$55.900', sales: '215 vendas' },
    { name: 'Lorem Ipsum', price: 'R$55.900', sales: '215 vendas' },
    { name: 'Lorem Ipsum', price: 'R$55.900', sales: '215 vendas' },
    { name: 'Lorem Ipsum', price: 'R$55.900', sales: '215 vendas' },
  ],
  recentOrders: [
    { id: '#25426', date: 'Nov 8, 2025', client: 'Kevin Emanuel', status: 'Enviado', value: 'R$260' },
    { id: '#25425', date: 'Nov 8, 2025', client: 'Rafael Lucas', status: 'Cancelado', value: 'R$260' },
    { id: '#25424', date: 'Nov 8, 2025', client: 'Nikôl José', status: 'Enviado', value: 'R$260' },
    { id: '#25423', date: 'Nov 8, 2025', client: 'Nikôl José', status: 'Cancelado', value: 'R$260' },
    { id: '#25422', date: 'Nov 8, 2025', client: 'Shahdah Maria', status: 'Enviado', value: 'R$260' },
    { id: '#25421', date: 'Nov 8, 2025', client: 'Yogesh Valentin', status: 'Enviado', value: 'R$260' },
  ]
};

const DashboardPage = () => {
  return (
    <ContentWrapper>
      <main className="dashboard-main-content">
        <h1 className="dashboard-title">Dashboard</h1>
        <KpiCards kpis={dashboardData.kpis} />
        <div className="dashboard-charts-container">
          <SalesChart />
          <BestSellers bestSellers={dashboardData.bestSellers} />
        </div>
        <RecentOrdersTable orders={dashboardData.recentOrders} />
      </main>
    </ContentWrapper>
  );
};

export default DashboardPage;