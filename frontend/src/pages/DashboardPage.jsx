import React from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import KpiCards from '../components/Dashboard/KpiCards.jsx';
import SalesChart from '../components/Dashboard/SalesChart.jsx';
import BestSellers from '../components/Dashboard/BestSellers.jsx';
import RecentOrdersTable from '../components/Dashboard/RecentOrdersTable.jsx';
import OrderDetailsModal from '../components/Dashboard/OrderDetailsModal.jsx';
import ContentWrapper from '../components/ContentWrapper.jsx';

import '../styles/Dashboard.css';

const DashboardPage = () => {
  const [kpis, setKpis] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('monthly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kpisResponse = await fetch('http://localhost:3000/dashboard/kpis');
        const kpisData = await kpisResponse.json();
        setKpis([
          { title: 'Total Pedidos', value: kpisData.totalPedidos },
          { title: 'Pedidos Ativos', value: kpisData.pedidosAtivos },
          { title: 'Pedidos Fechados', value: kpisData.pedidosFechados },
          { title: 'Pedidos Previstos', value: kpisData.pedidosPrevistos },
        ]);

        const bestSellersResponse = await fetch('http://localhost:3000/dashboard/best-sellers');
        const bestSellersData = await bestSellersResponse.json();
        setBestSellers(bestSellersData);

        const recentOrdersResponse = await fetch('http://localhost:3000/dashboard/recent-orders');
        const recentOrdersData = await recentOrdersResponse.json();
        setRecentOrders(recentOrdersData.map(order => ({
            ...order,
            valor_total_pedido: parseFloat(order.valor_total_pedido),
        })));
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const chartResponse = await fetch(`http://localhost:3000/dashboard/monthly-revenue?period=${chartPeriod}`);
        const chartData = await chartResponse.json();
        setMonthlyRevenue(chartData);
      } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
      }
    };
    fetchChartData();
  }, [chartPeriod]);

  const fetchOrderDetails = async (orderId) => {
    try {
        const response = await fetch(`http://localhost:3000/dashboard/orders/${orderId}`);
        const data = await response.json();
        setSelectedOrder(data);
    } catch (error) {
        console.error('Erro ao buscar detalhes do pedido:', error);
        setSelectedOrder(null);
    }
  };

  const handleSelectOrder = (order) => {
    fetchOrderDetails(order.id_pedido);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <ContentWrapper>
      <main className="dashboard-main-content">
        <h1 className-="dashboard-title">Dashboard</h1>
        <KpiCards kpis={kpis} />
        <div className="dashboard-charts-container">
          <SalesChart monthlyRevenue={monthlyRevenue} chartPeriod={chartPeriod} setChartPeriod={setChartPeriod} />
          <BestSellers bestSellers={bestSellers} />
        </div>
        <RecentOrdersTable orders={recentOrders} onSelectOrder={handleSelectOrder} />
      </main>
      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} />}
    </ContentWrapper>
  );
};

export default DashboardPage;