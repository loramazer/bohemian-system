const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Rota para buscar os KPIs
router.get('/kpis', dashboardController.getKpiData);

// Rota para buscar os produtos mais vendidos
router.get('/best-sellers', dashboardController.getBestSellers);

// Rota para buscar o faturamento mensal (para o gráfico de vendas)
router.get('/monthly-revenue', dashboardController.getMonthlyRevenue);

// Rota para buscar os pedidos recentes
router.get('/recent-orders', dashboardController.getRecentOrders);

router.get('/orders/:id', dashboardController.getOrderDetails);

module.exports = router;