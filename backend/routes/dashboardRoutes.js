const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rota para buscar os KPIs
router.get('/kpis', adminMiddleware, dashboardController.getKpiData);
router.get('/best-sellers', adminMiddleware, dashboardController.getBestSellers);
router.get('/monthly-revenue', adminMiddleware, dashboardController.getMonthlyRevenue);
router.get('/recent-orders', adminMiddleware, dashboardController.getRecentOrders);
router.get('/orders/:id', adminMiddleware, dashboardController.getOrderDetails);


module.exports = router;