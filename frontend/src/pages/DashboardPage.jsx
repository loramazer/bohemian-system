// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import KpiCards from '../components/Dashboard/KpiCards.jsx';
import SalesChart from '../components/Dashboard/SalesChart.jsx';
import BestSellers from '../components/Dashboard/BestSellers.jsx';
import RecentOrdersTable from '../components/Dashboard/RecentOrdersTable.jsx';
import OrderDetailsModal from '../components/Dashboard/OrderDetailsModal.jsx';
import ContentWrapper from '../components/Shared/ContentWrapper.jsx';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import apiClient from '../api.js';  
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext.jsx';

import '../styles/Dashboard.css';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);



const DashboardPage = () => {
    const { user, loading } = useContext(AuthContext); 
    const navigate = useNavigate();
    const [kpis, setKpis] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [chartPeriod, setChartPeriod] = useState('monthly');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const kpisResponse = await apiClient.get('/api/dashboard/kpis');
                const kpisData = kpisResponse.data;
                setKpis([
                    { title: 'Total Pedidos', value: kpisData.totalPedidos },
                    { title: 'Pedidos Ativos', value: kpisData.pedidosAtivos },
                    { title: 'Pedidos Fechados', value: kpisData.pedidosFechados },
                    { title: 'Pedidos Previstos', value: kpisData.pedidosPrevistos },
                ]);

                const bestSellersResponse = await apiClient.get('/api/dashboard/best-sellers');
                setBestSellers(bestSellersResponse.data);

                const recentOrdersResponse = await apiClient.get('/api/dashboard/recent-orders');
                const recentOrdersData = recentOrdersResponse.data;
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
                const chartResponse = await apiClient.get(`/api/dashboard/monthly-revenue?period=${chartPeriod}`);
                setMonthlyRevenue(chartResponse.data);
            } catch (error) {
                console.error('Erro ao buscar dados do gráfico:', error);
            }
        };
        fetchChartData();
    }, [chartPeriod]);


    if (!loading && (!user || user.admin !== 1)) {
        navigate('/');
        return null; 
    }
    
    if (loading || !user || user.admin !== 1) {
        return <ContentWrapper><div>Carregando...</div></ContentWrapper>;
    }

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await apiClient.get(`/api/dashboard/orders/${orderId}`);
            setSelectedOrder(response.data);
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
                <h1 className="dashboard-title">Dashboard</h1>
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