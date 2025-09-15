import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../../styles/Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = ({ monthlyRevenue, chartPeriod, setChartPeriod }) => {
    const data = {
        labels: monthlyRevenue.map(item => item.mes),
        datasets: [
            {
                label: 'Faturamento Mensal',
                data: monthlyRevenue.map(item => item.total_faturado),
                borderColor: '#5d7a7b',
                backgroundColor: 'rgba(93, 122, 123, 0.2)',
                fill: true,
                tension: 0.4
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Gráfico de Vendas',
            },
        },
    };

    return (
        <div className="sales-chart-container">
            <div className="chart-header">
                <h3>Gráfico Vendas</h3>
                <div className="chart-controls">
                    <button className={`chart-btn ${chartPeriod === 'monthly' ? 'active' : ''}`} onClick={() => setChartPeriod('monthly')}>Mês</button>
                    <button className={`chart-btn ${chartPeriod === 'semiannual' ? 'active' : ''}`} onClick={() => setChartPeriod('semiannual')}>Semestre</button>
                    <button className={`chart-btn ${chartPeriod === 'annual' ? 'active' : ''}`} onClick={() => setChartPeriod('annual')}>Ano</button>
                </div>
            </div>
            <div className="chart-placeholder">
                {monthlyRevenue.length > 0 ? (
                    <Line data={data} options={options} />
                ) : (
                    <p>Carregando dados do gráfico...</p>
                )}
            </div>
        </div>
    );
};

export default SalesChart;